'use server';

import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { registrations } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  cameraType: string;
  experienceLevel: string;
  goal: string;
}

export async function createRegistration(data: RegistrationData) {
  try {
    const existing = await db.query.registrations.findFirst({
      where: eq(registrations.email, data.email),
    });

    if (existing) {
      if (existing.paymentStatus === "paid") {
        return { success: false, error: "This email has already been registered and paid in full." };
      }
      
      // Update their details just in case they changed them on retry
      await db.update(registrations).set({
        fullName: data.fullName,
        phone: data.phone,
        city: data.city,
        cameraType: data.cameraType,
        experienceLevel: data.experienceLevel,
        goal: data.goal,
      }).where(eq(registrations.id, existing.id));

      const remainingAmount = 200 - (existing.amountPaid || 0);
      return { 
        success: true, 
        registrationId: existing.id,
        remainingAmount
      };
    }

    const [reg] = await db.insert(registrations).values({
      ...data,
      paymentStatus: "pending",
    }).returning({ id: registrations.id });

    return { success: true, registrationId: reg.id };
  } catch {
    return { success: false, error: "Failed to create registration. Please try again." };
  }
}

export async function verifyPaymentAndConfirm(reference: string, registrationId: string) {
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await res.json();

    if (data.status && data.data.status === "success") {
      const amountPaidGhs = data.data.amount / 100;
      
      const currentReg = await db.query.registrations.findFirst({
        where: eq(registrations.id, registrationId),
      });

      const newTotal = (currentReg?.amountPaid || 0) + amountPaidGhs;
      const isFullPayment = newTotal >= 200;

      await db.update(registrations)
        .set({
          paymentStatus: isFullPayment ? "paid" : "partial",
          paystackReference: reference,
          amountPaid: newTotal,
        })
        .where(eq(registrations.id, registrationId));

      return { success: true };
    }

    return { success: false, error: "Payment verification failed." };
  } catch {
    return { success: false, error: "Could not verify payment." };
  }
}

export async function getAllRegistrations() {
  return db.query.registrations.findMany({
    orderBy: (registrations, { desc }) => [desc(registrations.createdAt)],
  });
}

export async function rejectAndRefundRegistration(id: string) {
  try {
    const reg = await db.query.registrations.findFirst({
      where: eq(registrations.id, id),
    });

    if (!reg) return { success: false, error: "Registration not found." };

    if (reg.paystackReference && reg.paymentStatus !== "pending") {
      const refundRes = await fetch("https://api.paystack.co/refund", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transaction: reg.paystackReference,
        }),
      });

      const refundData = await refundRes.json();
      
      if (!refundRes.ok && !refundData.message?.toLowerCase().includes("refunded")) {
         return { success: false, error: refundData.message || "Failed to issue refund." };
      }
    }

    await db.delete(registrations).where(eq(registrations.id, id));
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "An unexpected error occurred while refunding." };
  }
}

export async function deleteRegistration(id: string) {
  try {
    await db.delete(registrations).where(eq(registrations.id, id));
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete registration." };
  }
}

export async function syncPaymentStatus(registrationId: string, email: string) {
  try {
    const res = await fetch(`https://api.paystack.co/transaction?email=${email}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await res.json();
    if (!data.status) return { success: false, error: "Failed to fetch from Paystack" };

    const successfulTransaction = data.data.find((tx: any) => {
      if (tx.status !== "success") return false;
      const metaRegId = tx.metadata?.custom_fields?.find((f: any) => f.variable_name === "registration_id")?.value;
      return metaRegId === registrationId;
    });

    if (successfulTransaction) {
      const amountPaidGhs = successfulTransaction.amount / 100;
      const isFullPayment = amountPaidGhs >= 200;

      await db.update(registrations)
        .set({
          paymentStatus: isFullPayment ? "paid" : "partial",
          paystackReference: successfulTransaction.reference,
          amountPaid: amountPaidGhs,
        })
        .where(eq(registrations.id, registrationId));

      revalidatePath("/admin");
      return { success: true, message: "Payment found and synced!" };
    }

    return { success: false, error: "No successful payment found on Paystack for this email." };
  } catch {
    return { success: false, error: "Could not sync payment status." };
  }
}

export async function reconcileFinances() {
  try {
    const allRegs = await db.query.registrations.findMany();
    let fixedCount = 0;

    for (const reg of allRegs) {
      if (!reg.paystackReference || reg.paymentStatus === "pending") continue;

      try {
        const res = await fetch(`https://api.paystack.co/transaction/verify/${reg.paystackReference}`, {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          },
        });
        const data = await res.json();
        
        if (!data.status) continue; // Skip if Paystack errors on this ref

        const tx = data.data;
        const metaRegId = tx.metadata?.custom_fields?.find((f: any) => f.variable_name === "registration_id")?.value;

        // If the transaction's metadata doesn't match this registration (or is missing), it's a false sync!
        // We revert the registration to pending.
        if (metaRegId !== reg.id) {
          await db.update(registrations)
            .set({ paymentStatus: "pending", paystackReference: null, amountPaid: 0 })
            .where(eq(registrations.id, reg.id));
          fixedCount++;
          continue;
        }

        // If it matches, check if it was refunded in Paystack
        if (tx.status === "reversed" || tx.status === "failed") {
          await db.update(registrations)
            .set({ paymentStatus: "pending", paystackReference: null, amountPaid: 0 })
            .where(eq(registrations.id, reg.id));
          fixedCount++;
        }
      } catch (err) {
        console.error("Error verifying ref", reg.paystackReference, err);
      }
    }

    revalidatePath("/admin");
    return { success: true, message: `Reconciliation complete. Fixed ${fixedCount} inaccurate records.` };
  } catch (error) {
    return { success: false, error: "Failed to reconcile finances." };
  }
}

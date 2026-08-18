'use server';

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

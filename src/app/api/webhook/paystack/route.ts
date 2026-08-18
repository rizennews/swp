import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
      .update(rawBody)
      .digest("hex");

    const signature = req.headers.get("x-paystack-signature");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const reference = event.data.reference;
      
      // Paystack metadata custom_fields might contain the ID if we passed it,
      // but if not, we can fall back to checking by email if the transaction was linked
      // However, we verify synchronously in the frontend anyway. This webhook is a fallback.
      // We will look up by email and pending status as a fallback if reference isn't stored yet.
      
      const email = event.data.customer.email;
      const amountPaidGhs = event.data.amount / 100;
      const isFullPayment = amountPaidGhs >= 200;

      // Find the pending registration for this email
      const pendingReg = await db.query.registrations.findFirst({
        where: (regs, { eq, and }) => and(
          eq(regs.email, email),
          eq(regs.paymentStatus, "pending")
        )
      });

      if (pendingReg) {
        const newTotal = (pendingReg.amountPaid || 0) + amountPaidGhs;
        const isNowFullPayment = newTotal >= 200;

        await db.update(registrations)
          .set({
            paymentStatus: isNowFullPayment ? "paid" : "partial",
            paystackReference: reference,
            amountPaid: newTotal,
          })
          .where(eq(registrations.id, pendingReg.id));
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}

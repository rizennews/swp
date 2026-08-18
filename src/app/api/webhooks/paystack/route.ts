import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { COURSE_FEE } from "@/lib/constants";

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(rawBody)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;
      const amountPaidGhs = data.amount / 100;
      
      const metaRegId = data.metadata?.custom_fields?.find(
        (f: any) => f.variable_name === "registration_id"
      )?.value;

      if (!metaRegId) {
         return NextResponse.json({ received: true, note: "No registration_id found in metadata" });
      }

      const currentReg = await db.query.registrations.findFirst({
        where: eq(registrations.id, metaRegId),
      });

      if (!currentReg) {
         return NextResponse.json({ received: true, note: "Registration not found" });
      }

      if (currentReg.paystackReference === reference) {
         return NextResponse.json({ received: true, note: "Already processed this transaction" });
      }

      const newTotal = (currentReg.amountPaid || 0) + amountPaidGhs;
      const isFullPayment = newTotal >= COURSE_FEE;

      await db.update(registrations)
        .set({
          paymentStatus: isFullPayment ? "paid" : "partial",
          paystackReference: reference,
          amountPaid: newTotal,
        })
        .where(eq(registrations.id, metaRegId));
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Paystack Webhook Error:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}

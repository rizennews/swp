import { NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/db";
import { registrations } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // 1. Get raw body for signature verification
    const text = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature found" }, { status: 400 });
    }

    // 2. Verify signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY as string)
      .update(text)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 3. Parse JSON
    const body = JSON.parse(text);
    const event = body.event;

    // 4. Handle "charge.success"
    if (event === "charge.success") {
      const reference = body.data.reference;
      const amountPaidGhs = body.data.amount / 100;
      
      // Extract registration ID from custom_fields
      const metadata = body.data.metadata;
      const metaRegId = metadata?.custom_fields?.find(
        (f: any) => f.variable_name === "registration_id"
      )?.value;

      if (!metaRegId) {
         // If no registration ID is found, we might try to look up by email as a fallback
         // But the proper flow uses metadata. We'll ignore if we can't link it.
         return NextResponse.json({ received: true, note: "No registration_id found in metadata" });
      }

      const isFullPayment = amountPaidGhs >= 200;

      await db.update(registrations)
        .set({
          paymentStatus: isFullPayment ? "paid" : "partial",
          paystackReference: reference,
          amountPaid: amountPaidGhs,
        })
        .where(eq(registrations.id, metaRegId));
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

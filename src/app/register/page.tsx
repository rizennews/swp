import { Suspense } from "react";
import RegistrationForm from "@/components/registration-form";
import Link from "next/link";

export const metadata = {
  title: "Register — Shoot With Purpose",
  description: "Secure your spot. Fill in your details and pay GHS 200 via Paystack.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0d0d14]">
      <div className="max-w-xl mx-auto px-8 py-24">
        <Link href="/" className="text-[#8b8b9e] hover:text-white text-sm transition-colors">
          ← Back
        </Link>

        <div className="mt-10 mb-10">
          <h1
            className="text-[38px] font-bold text-white leading-tight mb-3"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Secure your spot.
          </h1>
          <p className="text-[#8b8b9e] text-base">
            Fill in your details. Pay <span className="text-white">GHS 200</span> via Paystack to complete registration.
          </p>
          <p className="text-[#4a4a5a] text-xs mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Registration open · 20 spots only
          </p>
        </div>

        <Suspense fallback={<p className="text-[#8b8b9e] text-sm">Loading…</p>}>
          <RegistrationForm />
        </Suspense>
      </div>
    </div>
  );
}

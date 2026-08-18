"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRegistration, verifyPaymentAndConfirm } from "@/app/actions";
import { Loader2, ArrowRight } from "lucide-react";
import { COURSE_FEE } from "@/lib/constants";

declare global {
  interface Window {
    PaystackPop: {
      setup: (config: {
        key: string; email: string; amount: number; currency: string;
        ref: string; metadata: Record<string, unknown>;
        onClose: () => void;
        callback: (response: { reference: string }) => void;
      }) => { openIframe: () => void };
    };
  }
}

const inputCls = "bg-[#13131e] border-[#1e1e2e] text-white placeholder:text-[#3a3a4a] focus-visible:ring-0 focus-visible:border-[#3a3a4a] text-sm h-9 rounded";
const selectCls = "bg-[#13131e] border-[#1e1e2e] text-white focus:ring-0 focus:border-[#3a3a4a] text-sm h-9 rounded";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Label className="text-[#8b8b9e] text-xs mb-1.5 block">{children}</Label>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[#1e1e2e] pt-8">
      {children}
    </div>
  );
}

export default function RegistrationForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"form" | "paying" | "verifying">("form");
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", city: "",
    cameraType: "", experienceLevel: "", goal: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((p) => ({ ...p, [field]: value }));
    setError(null);
  };

  const loadPaystack = () => new Promise<void>((resolve) => {
    if (window.PaystackPop) return resolve();
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = () => resolve();
    document.head.appendChild(s);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    for (const [key, val] of Object.entries(form)) {
      if (!val.trim()) {
        setError(`Please fill in: ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`);
        setIsLoading(false);
        return;
      }
    }

    try {
      const result = await createRegistration(form);
      if (!result.success) { setError(result.error ?? "Failed."); setIsLoading(false); return; }

      await loadPaystack();
      setStep("paying");
      setIsLoading(false);

      const ref = `SWP-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const amountToPay = result.remainingAmount ? result.remainingAmount * 100 : COURSE_FEE * 100;

      window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: form.email,
        amount: amountToPay,
        currency: "GHS",
        ref,
        metadata: { 
          custom_fields: [
            { display_name: "Name", variable_name: "full_name", value: form.fullName },
            { display_name: "Registration ID", variable_name: "registration_id", value: result.registrationId! }
          ] 
        },
        onClose: function() { setStep("form"); setError("Payment cancelled. Your details are saved — try again."); },
        callback: function(response: any) {
          (async () => {
            setStep("verifying"); setIsLoading(true);
            const v = await verifyPaymentAndConfirm(response.reference, result.registrationId!);
            if (v.success) { router.push(`/success?name=${encodeURIComponent(form.fullName)}&id=${result.registrationId}`); }
            else { setError(v.error ?? "Verification failed."); setStep("form"); setIsLoading(false); }
          })();
        },
      }).openIframe();
    } catch (err: any) {
      console.error("Registration caught error:", err);
      setError(err?.message || "Something went wrong. Try again.");
      setStep("form"); setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      <Section title="Personal information">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div><FieldLabel>Full name</FieldLabel>
            <Input id="fullName" placeholder="Kofi Mensah" value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)} className={inputCls} /></div>
          <div><FieldLabel>Email</FieldLabel>
            <Input id="email" type="email" placeholder="kofi@email.com" value={form.email}
              onChange={(e) => handleChange("email", e.target.value)} className={inputCls} /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><FieldLabel>Phone</FieldLabel>
            <Input id="phone" placeholder="+233 24 000 0000" value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)} className={inputCls} /></div>
          <div><FieldLabel>City</FieldLabel>
            <Input id="city" placeholder="Accra" value={form.city}
              onChange={(e) => handleChange("city", e.target.value)} className={inputCls} /></div>
        </div>
      </Section>

      <Section title="Photography background">
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div><FieldLabel>Camera type</FieldLabel>
            <Select onValueChange={(v) => handleChange("cameraType", v as string)}>
              <SelectTrigger id="cameraType" className={selectCls}><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent className="bg-[#13131e] border-[#1e1e2e]">
                {["DSLR", "Mirrorless", "Smartphone", "Compact", "Other"].map((c) => (
                  <SelectItem key={c} value={c.toLowerCase()} className="text-[#8b8b9e] focus:bg-[#1e1e2e] focus:text-white text-sm">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div><FieldLabel>Experience level</FieldLabel>
            <Select onValueChange={(v) => handleChange("experienceLevel", v as string)}>
              <SelectTrigger id="experienceLevel" className={selectCls}><SelectValue placeholder="Select…" /></SelectTrigger>
              <SelectContent className="bg-[#13131e] border-[#1e1e2e]">
                {[["beginner", "Beginner (0–1 yr)"], ["intermediate", "Intermediate (1–3 yrs)"], ["advanced", "Advanced (3+ yrs)"], ["professional", "Professional"]].map(([v, l]) => (
                  <SelectItem key={v} value={v} className="text-[#8b8b9e] focus:bg-[#1e1e2e] focus:text-white text-sm">{l}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div><FieldLabel>What do you hope to achieve?</FieldLabel>
          <Textarea id="goal" placeholder="e.g. I want to shoot in manual mode and improve my street photography…"
            value={form.goal} onChange={(e) => handleChange("goal", e.target.value)} rows={3}
            className="bg-[#13131e] border-[#1e1e2e] text-white placeholder:text-[#3a3a4a] focus-visible:ring-0 focus-visible:border-[#3a3a4a] text-sm rounded resize-none" />
        </div>
      </Section>

      {/* Fee summary */}
      <div className="border-t border-[#1e1e2e] pt-8 flex items-center justify-between">
        <div>
          <p className="text-white text-sm font-semibold">Registration fee</p>
          <p className="text-[#4a4a5a] text-xs mt-0.5">Secure checkout via Paystack</p>
        </div>
        <span className="text-white font-bold text-xl">GHS {COURSE_FEE}</span>
      </div>

      {error && (
        <p className="text-red-400 text-sm border-l-2 border-red-800 pl-3">{error}</p>
      )}

      <button type="submit" id="pay-register-btn" disabled={isLoading}
        className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-white hover:bg-zinc-100 text-black font-semibold text-sm transition-colors disabled:opacity-40">
        {isLoading
          ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />{step === "verifying" ? "Verifying…" : "Processing…"}</>
          : <>Register & pay GHS {COURSE_FEE} <ArrowRight className="w-3.5 h-3.5" /></>}
      </button>


    </form>
  );
}

"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/ui/animations";

const included = [
  "3 days of hands-on training",
  "4 professional photographers as instructors",
  "Field sessions in Accra",
  "Lightroom editing workshop",
  "Certificate of completion",
  "Lunch + course materials included",
];

export default function CtaSection() {
  return (
    <section className="bg-[#0d0d14] py-20 border-t border-[#1e1e2e]">
      <div className="max-w-5xl mx-auto px-8 grid md:grid-cols-2 gap-16 items-start">
        <FadeUp>
          <h2
            className="text-[36px] font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            20 seats. One chance.<br />Don&apos;t watch someone else take yours.
          </h2>
          <p className="text-[#8b8b9e] text-base leading-relaxed">
            This masterclass only runs once a year. When the 20 spots are gone, registration closes — no exceptions, no waitlist. GHS 200 secures your seat today.
          </p>
        </FadeUp>

        <FadeUp delay={0.15} className="flex flex-col gap-5">
          <StaggerContainer className="divide-y divide-[#1e1e2e]" stagger={0.06}>
            {included.map((item) => (
              <StaggerItem key={item}>
                <div className="flex items-center gap-2.5 py-2.5">
                  <span className="text-amber-500 text-xs">✓</span>
                  <span className="text-[#8b8b9e] text-sm">{item}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Link href="/register" className="mt-2">
            <button
              id="cta-register-btn"
              className="w-full inline-flex items-center justify-center gap-2 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors"
            >
              Yes, I want this spot — GHS 200
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>

        </FadeUp>
      </div>
    </section>
  );
}

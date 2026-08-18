"use client";
import { FadeUp } from "@/components/ui/animations";
import { InfoRow } from "@/components/ui/info-row";

export default function DetailsSection() {
  return (
    <section id="details" className="bg-[#0d0d14] py-32 border-t border-[#1e1e2e]">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-2 gap-20">
          
          {/* Left Column: Heading and Context */}
          <FadeUp>
            <h2
              className="text-[36px] md:text-[48px] font-bold text-white leading-tight mb-8"
              style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
            >
              Everything you need to know.
            </h2>
            <p className="text-[#8b8b9e] text-lg leading-relaxed mb-12 max-w-md">
              Designed to be small and intimate. You get direct attention, real feedback, and a community of serious photographers. Bring any camera — DSLR, mirrorless, or smartphone.
            </p>
            
            <div className="pl-6 border-l-2 border-[#2e2e3e]">
              <p className="text-[#4a4a5a] text-sm leading-relaxed">
                Spots fill fast. Once 20 registrations are confirmed and paid, registration closes. No reservation without payment.
              </p>
            </div>
          </FadeUp>

          {/* Right Column: Simple Text List */}
          <FadeUp delay={0.1}>
            <div className="border-t border-[#1e1e2e]">
              <InfoRow label="Date" value="August 21 — 22, 2025" />
              <InfoRow label="Time" value="9:00 AM — 5:00 PM daily" />
              <InfoRow label="Location" value="Accra, Ghana (venue TBA)" />
              <InfoRow label="Class size" value="Maximum 20 participants" />
              <InfoRow label="Included" value="Notes, certificate" />
              <InfoRow label="Investment" value="GHS 200" isHighlight />
            </div>
          </FadeUp>
          
        </div>
      </div>
    </section>
  );
}

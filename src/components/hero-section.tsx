"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Staggered hero entrance — fires once on mount
const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as any } },
};

export default function HeroSection() {
  return (
    <section className="bg-[#0d0d14] border-b border-[#1e1e2e]">
      <div className="max-w-5xl mx-auto px-8 pt-32 pb-16">
        <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col">

          {/* Urgency badge */}
          <motion.div variants={item} className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#2e2e3e] text-xs text-[#8b8b9e]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Registration open · Only 20 spots available
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-[40px] md:text-[48px] font-bold text-white leading-[1.1] mb-5 max-w-2xl"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.025em" }}
          >
            Stop guessing.<br />Start shooting with purpose.
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={item} className="text-[#8b8b9e] text-base leading-relaxed max-w-xl mb-8">
            In 3 days, you&apos;ll go from unsure to unstoppable. Learn light, composition, and storytelling
            from photographers who have shot across Africa and beyond.{" "}
            <span className="text-white">GHS 200. One time. No fluff.</span>
          </motion.p>

          {/* CTA row */}
          <motion.div variants={item} className="flex flex-wrap items-center gap-4 mb-10">
            <Link href="/register">
              <button
                id="hero-register-btn"
                className="h-10 px-6 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm transition-colors inline-flex items-center gap-2"
              >
                Secure my spot — GHS 200
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
            <a href="#curriculum" className="text-[#8b8b9e] hover:text-white text-sm transition-colors">
              See what you&apos;ll learn →
            </a>
          </motion.div>

          {/* Trust line */}
          <motion.p variants={item} className="text-[#3a3a4a] text-xs">
            Aug 22–24, 2025 · Accra, Ghana · Certificate included · Lunch daily
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="border-t border-[#1e1e2e] bg-[#0a0a12]"
      >
        <div className="max-w-5xl mx-auto px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "3 Days", label: "Immersive training" },
            { value: "4 Instructors", label: "Industry professionals" },
            { value: "20 Spots", label: "Small class, real feedback" },
            { value: "GHS 200", label: "All-inclusive investment" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.75 + i * 0.08 }}
            >
              <p className="text-white text-sm font-semibold">{stat.value}</p>
              <p className="text-[#4a4a5a] text-xs mt-0.5">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

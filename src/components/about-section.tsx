"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const pillars = [
  {
    fig: "01",
    title: "You'll finally understand light.",
    description:
      "Most photographers shoot and hope. After Day 1, you'll know exactly why a shot works — and how to recreate it every time.",
    rotation: -2,
  },
  {
    fig: "02",
    title: "Every frame will mean something.",
    description:
      "You'll stop taking photos and start making them. Composition, intent, story — these will become instincts, not afterthoughts.",
    rotation: 3,
  },
  {
    fig: "03",
    title: "You'll leave with a real portfolio.",
    description:
      "Three days of shooting, editing, and critique. You'll walk away with work you're proud to show — and the skills to keep growing.",
    rotation: -1,
  },
  {
    fig: "04",
    title: "You'll master the business.",
    description:
      "Great photos aren't enough. You'll learn how to price your work, handle clients professionally, and build a sustainable photography brand.",
    rotation: 2,
  },
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Original perfectly-timed slide animations
  const y1 = useTransform(scrollYProgress, [0.1, 0.35], ["150vh", "0vh"]);
  const y2 = useTransform(scrollYProgress, [0.35, 0.6], ["150vh", "0vh"]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.85], ["150vh", "0vh"]);

  // First card sits statically at 0vh
  const ys = ["0vh", y1, y2, y3];

  return (
    <section id="about" ref={containerRef} className="bg-[#0d0d14] relative z-0" style={{ height: "400vh" }}>
      
      {/* 
        Original sticky wrapper.
        Uses flex-col to keep the text and cards perfectly stacked together with NO massive gaps.
      */}
      <div className="sticky top-0 h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden pt-12 md:pt-0">
        
        {/* 
          INTRO TEXT 
          Responsive sizing ensures it doesn't take up too much vertical space on mobile.
        */}
        <div className="w-full max-w-3xl px-6 md:px-8 text-center z-10 flex flex-col gap-3 md:gap-6 mb-6 md:mb-12">
          <h2
            className="text-[26px] md:text-[42px] font-bold text-white leading-tight"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Most photographers plateau because no one shows them the right things.
          </h2>
          <p 
            className="text-[#8b8b9e] text-sm md:text-xl leading-relaxed"
            style={{ fontFamily: "'Satoshi', sans-serif" }}
          >
            This masterclass fixes that. We’ve distilled years of professional experience into three intensive days. No fluff, just the exact techniques, mindset, and business strategies you need to elevate your craft and start shooting with true purpose.
          </p>
        </div>

        {/* 
          CARDS STACK
          Height is tightly controlled (380px on mobile, 500px on desktop)
          so that it fits underneath the text within 100svh perfectly.
        */}
        <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center h-[380px] md:h-[500px]">
          {pillars.map((p, i) => (
            <motion.div
              key={p.fig}
              className="absolute w-full px-4 md:px-8"
              style={{
                y: ys[i],
                zIndex: i,
              }}
            >
              {/* The Physical Card */}
              <div 
                className="w-full p-8 md:p-12 bg-[#111118] border border-[#2e2e3e] rounded-xl transition-transform duration-500 ease-out"
                style={{ transform: `rotate(${p.rotation}deg)` }}
              >
                <div
                  className="w-10 h-10 md:w-16 md:h-16 bg-[#1a1a24] border border-[#2e2e3e] text-white flex items-center justify-center rounded-full font-bold text-lg md:text-2xl mb-4 md:mb-6"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {p.fig}
                </div>
                
                <h3
                  className="text-xl md:text-3xl text-white font-black mb-3 md:mb-6"
                  style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
                >
                  {p.title}
                </h3>
                
                <hr className="border-[#2e2e3e] mb-3 md:mb-6" />
                
                <p className="text-[#8b8b9e] text-sm md:text-lg leading-relaxed font-medium">
                  {p.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

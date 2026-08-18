"use client";
import { Check } from "lucide-react";
import { FadeUp, StaggerContainer } from "@/components/ui/animations";

const days = [
  {
    fig: "Day 01",
    title: "Foundation & Field Session",
    date: "August 21, 2025",
    topics: [
      "Exposure triangle & reading natural light",
      "Composition rules and when to break them",
      "Field session: Street photography in Accra",
      "Approaching subjects & framing stories",
    ],
  },
  {
    fig: "Day 02",
    title: "Post-Processing & Portfolio",
    date: "August 22, 2025",
    topics: [
      "Lightroom editing workflow from scratch",
      "Colour grading and developing a personal style",
      "Building a cohesive photography portfolio",
      "Group critique and certificates",
    ],
  },
];

export default function CurriculumSection() {
  return (
    <section id="curriculum" className="bg-[#0d0d14] py-32 border-t border-[#1e1e2e] relative z-10">
      <div className="max-w-6xl mx-auto px-8">

        <FadeUp className="mb-20 text-center">
          <h2
            className="text-[32px] md:text-[44px] font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Two days. Intensive training.
          </h2>
          <p className="text-[#8b8b9e] text-lg max-w-2xl mx-auto">
            Each day builds on the last. Walk in as a photographer. Leave as a visual storyteller.
          </p>
        </FadeUp>

        {/* 2-Column Card Layout (Linear Style) */}
        <StaggerContainer className="grid md:grid-cols-2 gap-8">
          {days.map((d) => (
            <FadeUp key={d.fig} className="h-full">
              <div className="h-full flex flex-col p-8 rounded-2xl bg-[#111118] border border-[#2e2e3e] hover:border-[#4a4a5a] transition-colors duration-300">
                
                {/* Header */}
                <div className="mb-8">
                  <div className="inline-flex items-center justify-center px-3 py-1 mb-6 rounded-full border border-[#2e2e3e] bg-[#1a1a24] text-white text-xs font-semibold tracking-wide">
                    {d.fig}
                  </div>
                  <h3
                    className="text-xl text-white font-bold mb-2"
                    style={{ fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {d.title}
                  </h3>
                  <p className="text-[#8b8b9e] text-sm">
                    {d.date}
                  </p>
                </div>

                <hr className="border-[#2e2e3e] mb-8" />

                {/* Topics */}
                <ul className="space-y-4 mt-auto">
                  {d.topics.map((topic) => (
                    <li key={topic} className="flex items-start gap-3">
                      <div className="mt-0.5 w-4 h-4 rounded-full bg-[#1a1a24] border border-[#2e2e3e] flex items-center justify-center flex-shrink-0">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      <span className="text-[#8b8b9e] text-sm leading-relaxed">{topic}</span>
                    </li>
                  ))}
                </ul>

              </div>
            </FadeUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

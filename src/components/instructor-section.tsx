"use client";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { FadeUp } from "@/components/ui/animations";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

const instructors = [
  { id: 1, name: "Instructor Name", instagram: "@handle", instagramUrl: "https://instagram.com/handle", image: "/instructors/instructor-1.jpg" },
  { id: 2, name: "Instructor Name", instagram: "@handle", instagramUrl: "https://instagram.com/handle", image: "/instructors/instructor-2.jpg" },
  { id: 3, name: "Instructor Name", instagram: "@handle", instagramUrl: "https://instagram.com/handle", image: "/instructors/instructor-3.jpg" },
  { id: 4, name: "Instructor Name", instagram: "@handle", instagramUrl: "https://instagram.com/handle", image: "/instructors/instructor-4.jpg" },
];

function InstructorCard({ instructor, index }: { instructor: typeof instructors[0]; index: number }) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay: index * 0.1 }}
    >
      <div className="relative w-full aspect-[4/5] bg-[#1a1a24] overflow-hidden mb-4">
        {!imgError ? (
          <Image
            src={instructor.image}
            alt={instructor.name}
            fill
            className="object-cover object-top grayscale"
            sizes="(max-width: 768px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3a3a4a" strokeWidth="1">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </div>
        )}
      </div>
      <p className="text-white text-sm font-semibold mb-1">{instructor.name}</p>
      <a href={instructor.instagramUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[#8b8b9e] hover:text-white transition-colors text-xs">
        <InstagramIcon className="w-3.5 h-3.5" />
        {instructor.instagram}
      </a>
    </motion.div>
  );
}

export default function InstructorSection() {
  return (
    <section id="instructor" className="bg-[#0d0d14] py-20 border-t border-[#1e1e2e]">
      <div className="max-w-5xl mx-auto px-8">
        <FadeUp className="mb-16">
          <h2
            className="text-[38px] font-bold text-white leading-tight mb-4"
            style={{ fontFamily: "'Clash Display', sans-serif", letterSpacing: "-0.02em" }}
          >
            Meet the instructors
          </h2>
          <p className="text-[#8b8b9e] text-base max-w-lg">
            Four experienced photographers. One shared goal — help you shoot with purpose.
          </p>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {instructors.map((instructor, i) => (
            <InstructorCard key={instructor.id} instructor={instructor} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

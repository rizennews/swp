"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-colors duration-150 ${
      scrolled ? "bg-[#0d0d14]/95 border-b border-[#1e1e2e]" : "bg-transparent"
    }`}>
      <div className="max-w-5xl mx-auto px-8 h-12 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-sm">
          ShootWithPurpose
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {[
            { label: "About", href: "#about" },
            { label: "Curriculum", href: "#curriculum" },
            { label: "Details", href: "#details" },
            { label: "Instructors", href: "#instructor" },
          ].map((item) => (
            <a key={item.label} href={item.href}
              className="text-[#8b8b9e] hover:text-white text-sm transition-colors">
              {item.label}
            </a>
          ))}
        </div>

        {/* Amber CTA — not just "Sign up" */}
        <Link href="/register">
          <button className="h-8 px-4 rounded-full bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors">
            Register — GHS 200
          </button>
        </Link>
      </div>
    </nav>
  );
}

"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * StickyCard — wraps a section so it:
 * 1. Pins at the top (sticky) while the NEXT section scrolls up over it
 * 2. Scales down + dims as it gets "pushed into the deck"
 *
 * Usage: wrap every section EXCEPT the last one.
 * The last section just renders normally (nothing stacks over it).
 */
export function StickyCard({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress through this card's wrapper
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // As the next section scrolls up over this one, scale it back and dim it
  const scale = useTransform(scrollYProgress, [0.6, 1], [1, 0.93 - index * 0.005]);
  const opacity = useTransform(scrollYProgress, [0.6, 1], [1, 0.5]);
  const y = useTransform(scrollYProgress, [0.6, 1], [0, -12]);

  return (
    // Tall wrapper — gives scroll room for the overlap animation
    <div ref={ref} className="relative" style={{ minHeight: "120vh" }}>
      {/* The sticky card itself */}
      <div className="sticky" style={{ top: 48 }}>
        <motion.div style={{ scale, opacity, y, transformOrigin: "top center" }}>
          {children}
        </motion.div>
      </div>
    </div>
  );
}

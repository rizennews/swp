"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

/**
 * StickyCard — wraps a section so it:
 * 1. Pins at the top (sticky) while the NEXT section scrolls up over it
 * 2. Scales down + dims as it gets "pushed into the deck"
 *
 * Responsive fix: The sticky/stacking effect is DISABLED on mobile (md and below)
 * because tall sections get cut off when sticky on small viewports.
 * Instead, they just scroll normally on mobile.
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

  // Calculate transforms (only applied via CSS variables on desktop)
  const scaleVal = useTransform(scrollYProgress, [0.6, 1], [1, 0.93 - index * 0.005]);
  const opacityVal = useTransform(scrollYProgress, [0.6, 1], [1, 0.5]);
  const yVal = useTransform(scrollYProgress, [0.6, 1], [0, -12]);

  // Convert yVal to a string with "px" for CSS variable
  const yTemplate = useMotionTemplate`${yVal}px`;

  return (
    // Tall wrapper ONLY on desktop
    <div ref={ref} className="relative md:min-h-[120vh]">
      {/* Sticky ONLY on desktop */}
      <div className="md:sticky md:top-12">
        <motion.div
          style={
            {
              "--card-scale": scaleVal,
              "--card-opacity": opacityVal,
              "--card-y": yTemplate,
            } as any
          }
          className="origin-top md:[transform:scale(var(--card-scale))_translateY(var(--card-y))] md:[opacity:var(--card-opacity)]"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

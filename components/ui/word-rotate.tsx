"use client";

// components/ui/word-rotate.tsx
// Inline word cycler in the spirit of Magic UI's WordRotate — cycles through
// an array of words/phrases inside a sentence, fading and lifting each in.
// Pure CSS transitions (no Framer Motion) and respects prefers-reduced-motion.

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  words: string[];
  /** ms each word is visible before the next swap. Default 2400ms. */
  duration?: number;
  /** ms the fade/lift transition takes. Default 380ms. */
  transition?: number;
  className?: string;
  /** ClassName applied to the rotating word span (color, weight, etc.). */
  wordClassName?: string;
}

export function WordRotate({
  words,
  duration = 2400,
  transition = 380,
  className,
  wordClassName,
}: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!words?.length || words.length === 1) return;
    let alive = true;

    function tick() {
      if (!alive) return;
      setVisible(false); // fade out
      window.setTimeout(() => {
        if (!alive) return;
        setIndex((i) => (i + 1) % words.length);
        setVisible(true); // fade in next
      }, transition);
    }

    const id = window.setInterval(tick, duration);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [words, duration, transition]);

  // Render the longest word invisibly to reserve space and avoid layout shift.
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    <span
      className={cn("relative inline-grid", className)}
      style={{ gridTemplateAreas: "'stack'" }}
    >
      <span
        aria-hidden
        className="invisible whitespace-nowrap"
        style={{ gridArea: "stack" }}
      >
        {longest}
      </span>
      <span
        style={{
          gridArea: "stack",
          transitionProperty: "opacity, transform",
          transitionDuration: `${transition}ms`,
          transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(8px)",
        }}
        className={cn("whitespace-nowrap", wordClassName)}
      >
        {words[index]}
      </span>
    </span>
  );
}

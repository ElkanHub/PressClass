"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRecentPurchase } from "@/hooks/use-recent-purchase";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  isPill?: boolean;
}

interface Particle {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  isSparkle: boolean;
}

const SparkleSvg = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-full h-full fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]"
  >
    <path d="M12 0L14.8 9.2L24 12L14.8 14.8L12 24L9.2 14.8L0 12L9.2 9.2L12 0Z" />
  </svg>
);

export default function GoldSheenEffect({ className, isPill = false }: Props) {
  const { hasRecentPurchase } = useRecentPurchase();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!hasRecentPurchase) return;

    // Generate random particles for floating confetti
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // horizontal start percentage
      size: Math.random() * 8 + 4, // size from 4px to 12px
      delay: Math.random() * 3, // start delays up to 3s
      duration: Math.random() * 4 + 3, // drift duration 3s to 7s
      isSparkle: Math.random() > 0.4, // 60% sparkles, 40% circles
    }));

    setParticles(newParticles);
  }, [hasRecentPurchase]);

  if (!hasRecentPurchase) return null;

  if (isPill) {
    return (
      <span className="absolute inset-0 rounded-full border border-amber-400/50 bg-amber-400/10 pointer-events-none animate-[gold-shimmer-border_3s_infinite]" />
    );
  }

  return (
    <div className={cn("absolute inset-0 pointer-events-none select-none rounded-[inherit] overflow-hidden", className)}>
      {/* Premium Outer Gold Border Glow Overlay */}
      <div className="absolute inset-0 rounded-[inherit] border border-amber-400/40 pointer-events-none animate-[gold-shimmer-border_4s_ease-in-out_infinite] z-20" />

      {/* Metallic Sheen Wave Overlay */}
      <div className="gold-sheen-overlay z-10" />

      {/* Drifting Gold Sparkles / Confetti */}
      <div className="absolute inset-0 overflow-hidden z-10">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute opacity-0 pointer-events-none"
              style={{
                left: `${p.x}%`,
                bottom: "-20px",
                width: p.size,
                height: p.size,
              }}
              initial={{ y: 0, opacity: 0, scale: 0.5, rotate: 0 }}
              animate={{
                y: ["0%", "-130%"],
                opacity: [0, 0.9, 0.9, 0],
                scale: [0.5, 1.3, 0.8],
                rotate: p.isSparkle ? [0, 180, 360] : 0,
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut",
              }}
            >
              {p.isSparkle ? (
                <SparkleSvg />
              ) : (
                <span className="block w-full h-full rounded-full bg-amber-400/90 shadow-[0_0_8px_#fbbf24]" />
              )}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

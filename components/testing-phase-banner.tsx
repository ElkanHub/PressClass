"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Gift,
  ShieldCheck,
  Award,
  MessageSquareHeart,
  Sparkles,
} from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/feedback/feedback-dialog";

export default function TestingPhaseBanner() {
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const lastSeen = localStorage.getItem("pc_launch_banner_last_seen");

    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    if (!lastSeen || Date.now() - Number(lastSeen) > sevenDaysMs) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, []);

  function handleDismiss() {
    localStorage.setItem("pc_launch_banner_last_seen", Date.now().toString());

    setOpen(false);
  }

  function handleFeedbackTrigger() {
    localStorage.setItem("pc_launch_banner_last_seen", Date.now().toString());

    setOpen(false);

    setTimeout(() => {
      setFeedbackOpen(true);
    }, 250);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(v) => {
          if (!v) handleDismiss();
        }}
      >
        <DialogContent
          className="
          sm:max-w-3xl
          max-h-[90dvh]
          overflow-y-auto
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-emerald-500/20
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-emerald-500/40
          border
          border-white/10
          bg-[#07140F]
          p-0
          shadow-[0_30px_120px_rgba(0,0,0,0.8)]
          rounded-3xl
          text-white
        "
        >
          {/* BACKGROUND */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated Emerald Orb */}
            <motion.div
              animate={{
                x: [0, 40, 0],
                y: [0, -20, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
              absolute
              right-[-80px]
              top-[-120px]
              h-[260px]
              w-[260px]
              rounded-full
              bg-emerald-500/20
              blur-3xl
            "
            />

            {/* Animated Amber Orb */}
            <motion.div
              animate={{
                x: [0, -20, 0],
                y: [0, 30, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
              absolute
              left-[-100px]
              bottom-[-140px]
              h-[240px]
              w-[240px]
              rounded-full
              bg-amber-500/10
              blur-3xl
            "
            />

            {/* Grid Overlay */}
            <div
              className="
              absolute inset-0 opacity-[0.05]
              bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
              bg-[size:40px_40px]
            "
            />

            {/* Noise Texture */}
            <div
              className="
              absolute inset-0 opacity-[0.03]
              mix-blend-soft-light
              bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)]
              bg-[size:18px_18px]
            "
            />

            {/* Shimmer Sweep */}
            <motion.div
              animate={{
                x: ["-100%", "220%"],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
              absolute inset-y-0
              w-1/3
              skew-x-12
              bg-gradient-to-r
              from-transparent
              via-white/5
              to-transparent
            "
            />
          </div>

          {/* CONTENT */}
          <div className="relative z-10">
            {/* HERO */}
            <div className="px-5 pt-8 pb-5 text-center sm:px-8 sm:pt-10 sm:pb-8">
              {/* Floating Rocket */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative mx-auto mb-4 sm:mb-6 w-fit"
              >
                <div
                  className="
                  relative
                  flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center
                  rounded-2xl sm:rounded-3xl
                  border border-white/10
                  bg-white/[0.05]
                  backdrop-blur-xl
                  shadow-2xl
                "
                >
                  <Rocket className="h-7 w-7 sm:h-9 sm:w-9 text-emerald-400" />
                </div>

                {/* Pulse Ring */}
                <motion.div
                  animate={{
                    scale: [1, 1.4],
                    opacity: [0.5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="
                  absolute inset-0
                  rounded-2xl sm:rounded-3xl
                  border border-emerald-400
                "
                />
              </motion.div>

              {/* Badge */}
              <div
                className="
                inline-flex items-center gap-2
                rounded-full
                border border-emerald-400/20
                bg-emerald-400/10
                px-3.5 py-1 sm:px-4 sm:py-1.5
                text-[10px] sm:text-xs font-semibold tracking-wide
                text-emerald-300
                backdrop-blur-md
              "
              >
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                EARLY ACCESS
              </div>

              {/* Headline */}
              <h1
                className="
                mt-4 sm:mt-6
                text-2xl sm:text-4xl md:text-5xl
                font-black
                tracking-tight
                leading-tight
              "
              >
                Help Shape
                <span className="mt-1 sm:mt-2 block text-emerald-400">PressClass</span>
              </h1>

              {/* Subtitle */}
              <p
                className="
                mx-auto mt-3 sm:mt-5
                max-w-xl
                text-xs sm:text-sm md:text-base leading-relaxed
                text-zinc-300
              "
              >
                You’re among the first educators helping build the future of
                African lesson preparation. Explore new features early,
                influence product decisions, and unlock exclusive launch
                rewards.
              </p>
            </div>

            {/* PERKS */}
            <div className="px-5 pb-5 sm:px-8 sm:pb-6">
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
                {/* CARD 1 */}
                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  className="
                  group relative overflow-hidden
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  p-4 sm:p-5
                  backdrop-blur-xl
                  transition-all duration-300
                "
                >
                  <div
                    className="
                    absolute inset-0 opacity-0
                    transition-opacity duration-300
                    group-hover:opacity-100
                    bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_60%)]
                  "
                  />

                  <div
                    className="
                    relative mb-3 sm:mb-4
                    flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center
                    rounded-xl
                    bg-emerald-500/10
                    text-emerald-400
                  "
                  >
                    <Gift className="h-5 w-5" />
                  </div>

                  <h3 className="relative text-sm font-bold">
                    100% Launch Bonus
                  </h3>

                  <p className="relative mt-1.5 text-xs leading-relaxed text-zinc-400">
                    Get double credits on your first top-up after our official
                    launch.
                  </p>
                </motion.div>

                {/* CARD 2 */}
                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  className="
                  group relative overflow-hidden
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  p-4 sm:p-5
                  backdrop-blur-xl
                  transition-all duration-300
                "
                >
                  <div
                    className="
                    absolute inset-0 opacity-0
                    transition-opacity duration-300
                    group-hover:opacity-100
                    bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_60%)]
                  "
                  />

                  <div
                    className="
                    relative mb-3 sm:mb-4
                    flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center
                    rounded-xl
                    bg-amber-500/10
                    text-amber-400
                  "
                  >
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <h3 className="relative text-sm font-bold">
                    Founder Pricing
                  </h3>

                  <p className="relative mt-1.5 text-xs leading-relaxed text-zinc-400">
                    Lock in early supporter pricing forever. Never pay public
                    launch rates.
                  </p>
                </motion.div>

                {/* CARD 3 */}
                <motion.div
                  whileHover={{
                    y: -4,
                  }}
                  className="
                  group relative overflow-hidden
                  rounded-2xl
                  border border-white/10
                  bg-white/[0.03]
                  p-4 sm:p-5
                  backdrop-blur-xl
                  transition-all duration-300
                "
                >
                  <div
                    className="
                    absolute inset-0 opacity-0
                    transition-opacity duration-300
                    group-hover:opacity-100
                    bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.18),transparent_60%)]
                  "
                  />

                  <div
                    className="
                    relative mb-3 sm:mb-4
                    flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center
                    rounded-xl
                    bg-emerald-500/10
                    text-emerald-400
                  "
                  >
                    <Award className="h-5 w-5" />
                  </div>

                  <h3 className="relative text-sm font-bold">
                    Founding Teacher
                  </h3>

                  <p className="relative mt-1.5 text-xs leading-relaxed text-zinc-400">
                    Receive an exclusive early supporter badge on your
                    dashboard.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* FEEDBACK BOX */}
            <div className="px-5 pb-5 sm:px-8 sm:pb-6">
              <div
                className="
                relative overflow-hidden
                rounded-2xl
                border border-white/10
                bg-white/[0.03]
                p-4 sm:p-5
                backdrop-blur-xl
              "
              >
                <div className="flex gap-3 sm:gap-4">
                  <div
                    className="
                    flex h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-emerald-500/10
                    text-emerald-400
                  "
                  >
                    <MessageSquareHeart className="h-5 w-5" />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold">Your feedback matters</h4>

                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
                      We’re actively refining PressClass for African school
                      systems. Found a bug or have an idea? Your feedback
                      directly shapes what we build next.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              className="
              flex flex-col gap-3
              border-t border-white/5
              px-5 py-5
              sm:flex-row sm:px-8 sm:py-6
            "
            >
              <Button
                variant="ghost"
                onClick={handleFeedbackTrigger}
                className="
                h-11 sm:h-12 flex-1
                rounded-xl
                border border-white/10
                bg-white/[0.03]
                text-white
                hover:bg-white/[0.06]
                hover:text-white
              "
              >
                Share Feedback
              </Button>

              <Button
                onClick={handleDismiss}
                className="
                h-11 sm:h-12 flex-1
                rounded-xl
                bg-emerald-500
                font-bold
                text-black
                transition-all duration-300
                hover:scale-[1.02]
                hover:bg-emerald-400
              "
              >
                Start Exploring
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FEEDBACK DIALOG */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        title="Beta Testing Feedback"
        description="
          Share bugs, ideas, or suggestions.
          We review every submission carefully.
        "
      />
    </>
  );
}

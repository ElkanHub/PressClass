"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Gift, ShieldCheck, Award, MessageSquareHeart, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FeedbackDialog } from "@/components/feedback/feedback-dialog";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotate: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

const PAN_AFRICAN_COLORS = [
  "#0f766e", // emerald/teal
  "#f59e0b", // sunset amber
  "#16a34a", // vibrant green
  "#dc2626", // energetic red
  "#eab308", // gold
];

export default function TestingPhaseBanner() {
  const [open, setOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    // 7-day recurrence logic check
    const lastSeen = localStorage.getItem("pc_launch_banner_last_seen");
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

    if (!lastSeen || Date.now() - Number(lastSeen) > sevenDaysMs) {
      // Elegant 1.2-second entrance delay for maximum visual impact
      const timer = setTimeout(() => {
        setOpen(true);
        triggerConfettiBlast();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function triggerConfettiBlast() {
    const pieces = Array.from({ length: 65 }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 320, // explode left and right
      y: -Math.random() * 250 - 80, // initial explosion upwards
      rotate: Math.random() * 360,
      color: PAN_AFRICAN_COLORS[Math.floor(Math.random() * PAN_AFRICAN_COLORS.length)],
      size: Math.random() * 8 + 6, // 6px to 14px
      delay: Math.random() * 0.15, // slight stagger
      duration: Math.random() * 1.5 + 2.5, // 2.5s to 4s fall
    }));
    setConfetti(pieces);
  }

  function handleDismiss() {
    localStorage.setItem("pc_launch_banner_last_seen", Date.now().toString());
    setOpen(false);
  }

  function handleFeedbackTrigger() {
    localStorage.setItem("pc_launch_banner_last_seen", Date.now().toString());
    setOpen(false);
    // Slight delay so the welcome banner transitions out smoothly before the feedback form slides in
    setTimeout(() => {
      setFeedbackOpen(true);
    }, 300);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => {
        if (!v) handleDismiss();
      }}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none bg-gradient-to-b from-card to-background shadow-2xl rounded-2xl relative">
          
          {/* Celebrating Confetti Overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
            {open && confetti.map((p) => (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2 rounded-sm"
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 0, scale: 0.5 }}
                animate={{
                  x: [0, p.x, p.x * 1.2, p.x * 1.3],
                  y: [0, p.y, p.y + 100, p.y + 400],
                  rotate: [0, p.rotate, p.rotate * 2, p.rotate * 3],
                  opacity: [0, 1, 1, 0],
                  scale: [0.5, 1.2, 1, 0.5],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: [0.1, 0.8, 0.3, 1], // Custom snappy-to-smooth explosion curve
                }}
              />
            ))}
          </div>

          {/* Celebratory Gradient Banner Header */}
          <div className="bg-gradient-to-r from-teal-700 via-emerald-600 to-amber-500 p-8 text-white relative overflow-hidden flex flex-col items-center justify-center text-center">
            {/* Shimmer/Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none" />
            
            {/* Floating Animated Sparks in Header */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute -right-16 -top-16 w-48 h-48 border border-white/10 rounded-full pointer-events-none"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -left-12 -bottom-12 w-36 h-36 border border-white/5 rounded-full pointer-events-none"
            />

            {/* Glowing Rocket Icon Badge */}
            <div className="relative mb-3 flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <Rocket className="h-8 w-8 text-amber-300 animate-pulse" />
              <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-amber-300 animate-bounce" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Beta Testing & Launch Prep!</h2>
            <p className="mt-2 text-emerald-50 text-sm max-w-md">
              We are preparing to officially launch PressClass! Thank you for joining us early to shape the future of African lesson prep.
            </p>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Exclusive Perks Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                🎁 Exclusive Early Supporter Perks
              </h3>
              
              <div className="grid gap-3 sm:grid-cols-3">
                {/* Perk 1 */}
                <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition duration-200 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-2">
                    <Gift className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">100% Launch Bonus</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Get double credits on your very first top-up after we officially launch.
                  </p>
                </div>

                {/* Perk 2 */}
                <div className="p-4 rounded-xl border border-accent/15 bg-accent/5 hover:bg-accent/10 transition duration-200 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-2">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Founder Price Lock</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Lock in our lowest beta rates for life—never pay standard public pricing.
                  </p>
                </div>

                {/* Perk 3 */}
                <div className="p-4 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition duration-200 flex flex-col items-center text-center">
                  <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 flex items-center justify-center mb-2">
                    <Award className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-sm text-foreground">Founding Teacher</h4>
                  <p className="mt-1 text-xs text-muted-foreground">
                    An exclusive glowing badge on your dashboard to honor your day-one status.
                  </p>
                </div>
              </div>
            </div>

            {/* Feedback Instructions Section */}
            <div className="p-4 rounded-xl bg-muted/50 border flex gap-4 items-start">
              <div className="mt-1 flex items-center justify-center w-8 h-8 rounded-lg bg-teal-600/10 text-teal-600 dark:text-teal-400 flex-shrink-0">
                <MessageSquareHeart className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-foreground">Your feedback is our fuel!</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We are tuning PressClass for African school systems. Spotted a bug or have an idea? Help us perfect it! You can submit feedback anytime via the <span className="font-semibold text-foreground">Send Feedback</span> button in the top-right menu (under your avatar) or click right below.
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="w-full order-2 sm:order-1 border-primary/20 hover:bg-primary/5 hover:text-primary transition"
                onClick={handleFeedbackTrigger}
              >
                Share Feedback Now
              </Button>
              <Button
                className="w-full order-1 sm:order-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-semibold transition"
                onClick={handleDismiss}
              >
                Start Exploring!
              </Button>
            </div>

          </div>

        </DialogContent>
      </Dialog>

      {/* Embedded Feedback Dialog */}
      <FeedbackDialog
        open={feedbackOpen}
        onOpenChange={setFeedbackOpen}
        title="Beta Testing Feedback"
        description="Share bugs, suggestions, or praise. We review every single submission to make lesson planning effortless for you."
      />
    </>
  );
}

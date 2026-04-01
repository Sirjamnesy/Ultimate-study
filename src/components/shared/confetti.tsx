"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["🎉", "⭐", "🚀", "💜", "✨", "🔥", "💎", "🏆"];

type Particle = {
  id: number;
  emoji: string;
  x: number;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
};

export function Confetti({
  trigger,
  message,
}: {
  trigger: boolean;
  message?: string;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setShow(true);
    const newParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      rotation: Math.random() * 720 - 360,
      size: 16 + Math.random() * 16,
    }));
    setParticles(newParticles);
    const timer = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(timer);
  }, [trigger]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[100]"
        >
          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                left: `${p.x}%`,
                top: "-5%",
                rotate: 0,
                opacity: 1,
              }}
              animate={{
                top: "110%",
                rotate: p.rotation,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                ease: "easeIn",
              }}
              className="absolute"
              style={{ fontSize: p.size }}
            >
              {p.emoji}
            </motion.div>
          ))}

          {/* Centered message */}
          {message && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-card/95 backdrop-blur-md border-2 border-dashed border-violet-500/40 rounded-2xl px-8 py-5 shadow-2xl sketch-border text-center">
                <p className="text-2xl font-sketch font-bold">{message}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function XPToast({
  amount,
  show,
}: {
  amount: number;
  show: boolean;
}) {
  return (
    <AnimatePresence>
      {show && amount !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ type: "spring", damping: 15 }}
          className="fixed bottom-6 right-6 z-[90]"
        >
          <div className="bg-violet-600 text-white px-4 py-2 rounded-xl font-mono text-sm font-bold shadow-lg sketch-border-sm flex items-center gap-2">
            <span className="text-lg">⚡</span>
            {amount > 0 ? "+" : ""}
            {amount} XP
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function LevelUpCelebration({
  level,
  title,
  onComplete,
}: {
  level: number;
  title: string;
  onComplete: () => void;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 1.5 + Math.random() * 2,
      rotation: Math.random() * 720 - 360,
      size: 18 + Math.random() * 18,
    }));
    setParticles(newParticles);
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 pointer-events-none z-[100]"
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ left: `${p.x}%`, top: "-5%", rotate: 0, opacity: 1 }}
          animate={{ top: "110%", rotate: p.rotation, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
          className="absolute"
          style={{ fontSize: p.size }}
        >
          {p.emoji}
        </motion.div>
      ))}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 12, delay: 0.2 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="bg-card/95 backdrop-blur-md border-2 border-dashed border-amber-500/50 rounded-2xl px-10 py-6 shadow-2xl sketch-border text-center">
          <p className="text-sm font-mono text-amber-400 uppercase tracking-widest mb-1">Level Up!</p>
          <p className="text-3xl font-sketch font-bold">
            Level {level} — {title}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Keep going! 🚀</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

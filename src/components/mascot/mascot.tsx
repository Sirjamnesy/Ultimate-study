"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type MascotPose =
  | "wave"
  | "study"
  | "celebrate"
  | "thinking"
  | "sleeping"
  | "sad"
  | "reading";

const POSE_ASSET: Record<MascotPose, string> = {
  wave: "/mascot/wave.svg",
  study: "/mascot/study.svg",
  celebrate: "/mascot/celebrate.svg",
  thinking: "/mascot/thinking.svg",
  sleeping: "/mascot/sleeping.svg",
  sad: "/mascot/sad.svg",
  reading: "/mascot/reading.svg",
};

/**
 * Flip to true once real artwork lands in public/mascot/*.svg (produced via
 * a design pass — see the mascot milestone in the project plan). Until then
 * every call site below renders the existing violet Zap-square mark instead
 * of a broken image, and needs no changes when the switch happens.
 */
const ARTWORK_READY = false;

export function Mascot({
  pose,
  size = 64,
  className,
}: {
  pose: MascotPose;
  size?: number;
  className?: string;
}) {
  if (!ARTWORK_READY) {
    return (
      <div
        className={cn(
          "rounded-2xl bg-violet-600 flex items-center justify-center sketch-border-sm rotate-[-2deg] shrink-0",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Zap className="text-white" style={{ width: size * 0.45, height: size * 0.45 }} />
      </div>
    );
  }

  return (
    <motion.img
      src={POSE_ASSET[pose]}
      alt=""
      width={size}
      height={size}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn("shrink-0", className)}
    />
  );
}

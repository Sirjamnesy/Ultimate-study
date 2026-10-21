import { cn } from "@/lib/utils";

// R1 "Rising cut" W mark: four strokes, every top cut on one rising line.
const MARK_PATH =
  "M4.5 54.6L21.5 45.4L38.5 90L21.5 90ZM39.5 35.7L56.5 26.5L38.5 90L21.5 90ZM39.5 35.7L56.5 26.5L74.5 90L57.5 90ZM78.5 14.6L95.5 5.4L74.5 90L57.5 90Z";

export function WekaroMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("h-6 w-6 shrink-0", className)}
      fill="currentColor"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={MARK_PATH} />
    </svg>
  );
}

// Wordmark A: lowercase, Epilogue 900, -0.065em. Always one colour.
export function WekaroWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-black lowercase leading-none tracking-[-0.065em]", className)}>
      wekaro
    </span>
  );
}

// Lockup: mark height matches the "k", gap is about one stroke.
export function WekaroLogo({
  className,
  markClassName,
  wordClassName,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)} aria-label="Wekaro">
      <WekaroMark className={cn("h-[0.9em] w-[0.9em]", markClassName)} />
      <WekaroWordmark className={wordClassName} />
    </span>
  );
}

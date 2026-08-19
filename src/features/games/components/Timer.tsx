import { useEffect, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface TimerProps {
  /** ISO timestamp the countdown started. */
  startedAt: string;
  totalSeconds: number;
  onExpire?: () => void;
  className?: string;
}

/**
 * Ticks locally off `startedAt` (rather than the ~1s poll interval) so the
 * countdown animates smoothly instead of jumping once per fetch.
 */
export function Timer({ startedAt, totalSeconds, onExpire, className }: TimerProps) {
  const [remainingMs, setRemainingMs] = useState(() => {
    const elapsed = Date.now() - new Date(startedAt).getTime();
    return Math.max(totalSeconds * 1000 - elapsed, 0);
  });
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    hasExpiredRef.current = false;
    const startedAtMs = new Date(startedAt).getTime();
    const totalMs = totalSeconds * 1000;

    const tick = () => {
      const remaining = Math.max(totalMs - (Date.now() - startedAtMs), 0);
      setRemainingMs(remaining);
      if (remaining <= 0 && !hasExpiredRef.current) {
        hasExpiredRef.current = true;
        onExpire?.();
      }
    };

    tick();
    const interval = setInterval(tick, 100);
    return () => clearInterval(interval);
  }, [startedAt, totalSeconds, onExpire]);

  const remainingSeconds = Math.ceil(remainingMs / 1000);
  const percent = totalSeconds > 0 ? (remainingMs / (totalSeconds * 1000)) * 100 : 0;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-muted-foreground">Time remaining</span>
        <span className={cn("tabular-nums font-bold", percent < 25 && "text-destructive")}>
          {remainingSeconds}s
        </span>
      </div>
      <Progress
        value={percent}
        indicatorClassName={cn(percent < 25 ? "bg-destructive" : "bg-primary")}
      />
    </div>
  );
}

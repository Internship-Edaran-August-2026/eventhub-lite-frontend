import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { PlayerAvatar } from "@/features/games/components/PlayerAvatar";
import type { GamePlayer } from "@/features/games/types/game.types";

interface LeaderboardProps {
  players: GamePlayer[];
  limit?: number;
  className?: string;
}

const RANK_ACCENT = ["text-amber-500", "text-slate-400", "text-amber-700"];

export function Leaderboard({ players, limit = 5, className }: LeaderboardProps) {
  const ranked = [...players].sort((a, b) => b.score - a.score).slice(0, limit);

  return (
    <ol className={cn("space-y-2", className)}>
      {ranked.map((player, index) => (
        <li
          key={player.id}
          className="flex items-center gap-3 rounded-lg bg-card px-3 py-2 ring-1 ring-foreground/10"
        >
          <span
            className={cn(
              "w-5 shrink-0 text-center text-sm font-bold text-muted-foreground",
              RANK_ACCENT[index]
            )}
          >
            {index < 3 ? <Trophy className="size-4" /> : index + 1}
          </span>
          <PlayerAvatar nickname={player.nickname} size="sm" />
          <span className="flex-1 truncate text-sm font-medium">{player.nickname}</span>
          <span className="text-sm font-semibold tabular-nums">{player.score.toLocaleString()}</span>
        </li>
      ))}
      {ranked.length === 0 && (
        <li className="rounded-lg bg-muted px-3 py-6 text-center text-sm text-muted-foreground">
          No scores yet.
        </li>
      )}
    </ol>
  );
}

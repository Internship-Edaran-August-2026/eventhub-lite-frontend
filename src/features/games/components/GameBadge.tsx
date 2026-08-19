import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { GameSessionStatus } from "@/features/games/types/game.types";

const STATUS_LABEL: Record<GameSessionStatus, string> = {
  LOBBY: "Lobby",
  IN_PROGRESS: "In Progress",
  QUESTION_ACTIVE: "Question Live",
  REVEAL_ANSWER: "Revealing Answer",
  LEADERBOARD: "Leaderboard",
  FINISHED: "Finished",
};

const STATUS_CLASSNAME: Record<GameSessionStatus, string> = {
  LOBBY: "bg-secondary text-secondary-foreground",
  IN_PROGRESS: "bg-primary text-primary-foreground",
  QUESTION_ACTIVE: "bg-primary text-primary-foreground",
  REVEAL_ANSWER: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  LEADERBOARD: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  FINISHED: "bg-muted text-muted-foreground",
};

interface GameBadgeProps {
  status: GameSessionStatus;
  className?: string;
}

export function GameBadge({ status, className }: GameBadgeProps) {
  return (
    <Badge className={cn(STATUS_CLASSNAME[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

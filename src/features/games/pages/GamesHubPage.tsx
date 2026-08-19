import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { gameService } from "@/features/games/api/gameService";
import { GameCard } from "@/features/games/components/GameCard";
import type { GameCatalogEntry } from "@/features/games/types/game.types";

const GAME_ROUTES: Record<string, string> = {
  "quiz-trivia": "/games/quiz-trivia",
};

export function GamesHubPage() {
  const navigate = useNavigate();

  const { data: games, isLoading } = useQuery({
    queryKey: ["games"],
    queryFn: () => gameService.list(),
  });

  const handleLaunch = (game: GameCatalogEntry) => {
    const route = GAME_ROUTES[game.id];
    if (route) navigate(route);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Games Hub</h1>
        <p className="text-muted-foreground">Launch interactive live games for your events.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}

        {games?.map((game) => (
          <GameCard key={game.id} game={game} onLaunch={handleLaunch} />
        ))}
      </div>
    </div>
  );
}

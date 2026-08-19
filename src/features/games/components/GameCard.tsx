import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { GameCatalogEntry } from "@/features/games/types/game.types";

interface GameCardProps {
  game: GameCatalogEntry;
  onLaunch?: (game: GameCatalogEntry) => void;
}

export function GameCard({ game, onLaunch }: GameCardProps) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[game.icon] ?? Icons.Gamepad2;

  return (
    <Card className="justify-between">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          {game.comingSoon && <Badge variant="outline">Coming soon</Badge>}
        </div>
        <CardTitle className="text-base">{game.name}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          className="w-full"
          disabled={!game.isAvailable}
          onClick={() => onLaunch?.(game)}
        >
          {game.isAvailable ? "Launch" : "Unavailable"}
        </Button>
      </CardFooter>
    </Card>
  );
}

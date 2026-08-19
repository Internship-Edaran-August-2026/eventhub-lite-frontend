import { apiClient } from "@/api/client";
import type { GameCatalogEntry } from "@/features/games/types/game.types";

export const gameService = {
  async list(): Promise<GameCatalogEntry[]> {
    const { data } = await apiClient.get<GameCatalogEntry[]>("/games");
    return data;
  },
  async get(id: string): Promise<GameCatalogEntry> {
    const { data } = await apiClient.get<GameCatalogEntry>(`/games/${id}`);
    return data;
  },
};

import { apiClient } from "@/api/client";
import { generateId, generatePinCode } from "@/features/games/lib/id";
import type { GamePlayer } from "@/features/games/types/game.types";
import type { QuizSession } from "@/features/games/types/quiz.types";

export const quizSessionService = {
  async get(id: string): Promise<QuizSession> {
    const { data } = await apiClient.get<QuizSession>(`/gameSessions/${id}`);
    return data;
  },

  async findByPinCode(pinCode: string): Promise<QuizSession | null> {
    const { data } = await apiClient.get<QuizSession[]>("/gameSessions", {
      params: { pinCode },
    });
    return data[0] ?? null;
  },

  async create(eventId: string, hostId: string, questionIds: string[]): Promise<QuizSession> {
    const now = new Date().toISOString();
    const session: QuizSession = {
      id: generateId("sess"),
      eventId,
      gameTypeId: "quiz-trivia",
      pinCode: generatePinCode(),
      status: "LOBBY",
      hostId,
      activePlayers: [],
      questionIds,
      currentQuestionIndex: 0,
      questionStartedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    const { data } = await apiClient.post<QuizSession>("/gameSessions", session);
    return data;
  },

  async update(id: string, patch: Partial<QuizSession>): Promise<QuizSession> {
    const { data } = await apiClient.patch<QuizSession>(`/gameSessions/${id}`, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    return data;
  },

  /**
   * json-server has no atomic array-append, so joining reads the current
   * player list and writes it back with the new player. Two players
   * joining in the same ~1s polling tick can race and one join can be
   * lost; acceptable for a mock/demo backend, not production-safe.
   */
  async joinSession(pinCode: string, nickname: string): Promise<{ session: QuizSession; player: GamePlayer }> {
    const session = await this.findByPinCode(pinCode);
    if (!session) {
      throw new Error("No live game found for that PIN.");
    }
    if (session.status !== "LOBBY") {
      throw new Error("This game has already started.");
    }
    const player: GamePlayer = { id: generateId("plr"), nickname, score: 0 };
    const updated = await this.update(session.id, {
      activePlayers: [...session.activePlayers, player],
    });
    return { session: updated, player };
  },
};

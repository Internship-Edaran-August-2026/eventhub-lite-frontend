/**
 * Core types shared by every game engine module (quiz, spin-the-wheel,
 * raffle, memory-match, ...). A new game type plugs in by:
 *   1. Adding a catalog entry to db.json `games` with a unique `id`.
 *   2. Defining its own session shape extending GameSessionBase in
 *      `types/<game>.types.ts` (see quiz.types.ts for the reference impl).
 *   3. Adding a `modules/<game>/` directory with its own components/hooks.
 *   4. Registering the module's admin entry point in GamesHubPage.
 */

export type GameSessionStatus =
  | "LOBBY"
  | "IN_PROGRESS"
  | "QUESTION_ACTIVE"
  | "REVEAL_ANSWER"
  | "LEADERBOARD"
  | "FINISHED";

export interface GameCatalogEntry {
  id: string;
  name: string;
  description: string;
  icon: string;
  isAvailable: boolean;
  comingSoon?: boolean;
}

export interface GamePlayer {
  id: string;
  nickname: string;
  score: number;
}

/**
 * Fields every live game session shares, regardless of game type.
 * Game-specific modules extend this with their own runtime state
 * (e.g. QuizSession adds currentQuestionIndex, questionStartedAt, answers).
 */
export interface GameSessionBase {
  id: string;
  eventId: string;
  gameTypeId: string;
  pinCode: string;
  status: GameSessionStatus;
  hostId: string;
  activePlayers: GamePlayer[];
  createdAt: string;
  updatedAt: string;
}

import type { GameSessionBase } from "./game.types";

export type QuizOptionIndex = 0 | 1 | 2 | 3;

export const QUIZ_OPTION_LABELS = ["A", "B", "C", "D"] as const;

export interface QuizQuestion {
  id: string;
  eventId: string;
  questionText: string;
  imageUrl?: string;
  options: [string, string, string, string];
  correctOptionIndex: QuizOptionIndex;
  timeLimitSeconds: number;
  order: number;
}

export type QuizQuestionFormValues = Omit<QuizQuestion, "id">;

/**
 * One player's submitted answer for one question. Stored as its own
 * db.json collection (`quizAnswers`) rather than nested on the session
 * document, so concurrent player submissions don't race on a single
 * PATCH to the same record (json-server has no atomic array append).
 */
export interface QuizAnswerRecord {
  id: string;
  sessionId: string;
  questionIndex: number;
  playerId: string;
  selectedOptionIndex: QuizOptionIndex | null;
  timeTakenMs: number;
  pointsAwarded: number;
  isCorrect: boolean;
  submittedAt: string;
}

export interface QuizSession extends GameSessionBase {
  gameTypeId: "quiz-trivia";
  questionIds: string[];
  currentQuestionIndex: number;
  /** ISO timestamp the current question went live; null when not active. */
  questionStartedAt: string | null;
}

export interface QuizAnswerTally {
  optionIndex: QuizOptionIndex;
  count: number;
}

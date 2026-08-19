import { apiClient } from "@/api/client";
import { generateId } from "@/features/games/lib/id";
import type { QuizAnswerRecord, QuizOptionIndex } from "@/features/games/types/quiz.types";

export interface SubmitAnswerInput {
  sessionId: string;
  questionIndex: number;
  playerId: string;
  selectedOptionIndex: QuizOptionIndex | null;
  timeTakenMs: number;
  pointsAwarded: number;
  isCorrect: boolean;
}

export const quizAnswerService = {
  async submit(input: SubmitAnswerInput): Promise<QuizAnswerRecord> {
    const record: QuizAnswerRecord = {
      id: generateId("ans"),
      submittedAt: new Date().toISOString(),
      ...input,
    };
    const { data } = await apiClient.post<QuizAnswerRecord>("/quizAnswers", record);
    return data;
  },

  async listForQuestion(sessionId: string, questionIndex: number): Promise<QuizAnswerRecord[]> {
    const { data } = await apiClient.get<QuizAnswerRecord[]>("/quizAnswers", {
      params: { sessionId, questionIndex },
    });
    return data;
  },

  async findMine(sessionId: string, questionIndex: number, playerId: string): Promise<QuizAnswerRecord | null> {
    const { data } = await apiClient.get<QuizAnswerRecord[]>("/quizAnswers", {
      params: { sessionId, questionIndex, playerId },
    });
    return data[0] ?? null;
  },
};

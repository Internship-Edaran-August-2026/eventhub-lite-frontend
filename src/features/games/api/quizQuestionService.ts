import { apiClient } from "@/api/client";
import type { QuizQuestion, QuizQuestionFormValues } from "@/features/games/types/quiz.types";

export const quizQuestionService = {
  async listByEvent(eventId: string): Promise<QuizQuestion[]> {
    const { data } = await apiClient.get<QuizQuestion[]>("/quizQuestions", {
      params: { eventId, _sort: "order" },
    });
    return data;
  },
  async get(id: string): Promise<QuizQuestion> {
    const { data } = await apiClient.get<QuizQuestion>(`/quizQuestions/${id}`);
    return data;
  },
  async create(values: QuizQuestionFormValues): Promise<QuizQuestion> {
    const { data } = await apiClient.post<QuizQuestion>("/quizQuestions", values);
    return data;
  },
  async update(id: string, values: QuizQuestionFormValues): Promise<QuizQuestion> {
    const { data } = await apiClient.put<QuizQuestion>(`/quizQuestions/${id}`, values);
    return data;
  },
  async remove(id: string): Promise<void> {
    await apiClient.delete(`/quizQuestions/${id}`);
  },
};

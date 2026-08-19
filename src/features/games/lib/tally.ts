import type { QuizAnswerRecord, QuizAnswerTally, QuizOptionIndex } from "@/features/games/types/quiz.types";

export function tallyAnswers(answers: QuizAnswerRecord[]): QuizAnswerTally[] {
  const counts = new Map<QuizOptionIndex, number>([[0, 0], [1, 0], [2, 0], [3, 0]]);
  for (const answer of answers) {
    if (answer.selectedOptionIndex !== null) {
      counts.set(answer.selectedOptionIndex, (counts.get(answer.selectedOptionIndex) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries()).map(([optionIndex, count]) => ({ optionIndex, count }));
}

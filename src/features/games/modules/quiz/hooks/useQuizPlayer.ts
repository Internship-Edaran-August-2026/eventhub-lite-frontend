import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizSessionService } from "@/features/games/api/quizSessionService";
import { quizQuestionService } from "@/features/games/api/quizQuestionService";
import { quizAnswerService } from "@/features/games/api/quizAnswerService";
import { calculateQuizScore } from "@/features/games/lib/scoring";
import type { QuizOptionIndex } from "@/features/games/types/quiz.types";

export function useJoinQuizSession() {
  return useMutation({
    mutationFn: ({ pinCode, nickname }: { pinCode: string; nickname: string }) =>
      quizSessionService.joinSession(pinCode, nickname),
  });
}

/**
 * Player-side hook: polls the same session document the host polls, so the
 * gamepad screen follows the host's state transitions (LOBBY -> QUESTION
 * _ACTIVE -> REVEAL_ANSWER -> ...) within one ~1s tick.
 */
export function useQuizPlayer(sessionId: string | undefined, playerId: string | undefined) {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery({
    queryKey: ["gameSessions", sessionId],
    queryFn: () => quizSessionService.get(sessionId!),
    enabled: !!sessionId,
    refetchInterval: 1000,
  });

  const session = sessionQuery.data;

  const questionsQuery = useQuery({
    queryKey: ["quizQuestions", "byEvent", session?.eventId],
    queryFn: () => quizQuestionService.listByEvent(session!.eventId),
    enabled: !!session?.eventId,
  });

  const currentQuestion = useMemo(() => {
    if (!session || !questionsQuery.data) return undefined;
    const currentId = session.questionIds[session.currentQuestionIndex];
    return questionsQuery.data.find((q) => q.id === currentId);
  }, [session, questionsQuery.data]);

  const myAnswerQuery = useQuery({
    queryKey: ["quizAnswers", "mine", sessionId, session?.currentQuestionIndex, playerId],
    queryFn: () => quizAnswerService.findMine(sessionId!, session!.currentQuestionIndex, playerId!),
    enabled: !!sessionId && !!playerId && session !== undefined,
    refetchInterval: 1000,
  });

  const myScore = session?.activePlayers.find((p) => p.id === playerId)?.score ?? 0;

  const submitAnswer = useMutation({
    mutationFn: async (selectedOptionIndex: QuizOptionIndex) => {
      if (!session || !currentQuestion || !playerId) {
        throw new Error("No active question to answer.");
      }
      const startedAt = session.questionStartedAt ? new Date(session.questionStartedAt).getTime() : Date.now();
      const timeTakenMs = Math.max(Date.now() - startedAt, 0);
      const isCorrect = selectedOptionIndex === currentQuestion.correctOptionIndex;
      const pointsAwarded = isCorrect ? calculateQuizScore(timeTakenMs, currentQuestion.timeLimitSeconds) : 0;

      return quizAnswerService.submit({
        sessionId: session.id,
        questionIndex: session.currentQuestionIndex,
        playerId,
        selectedOptionIndex,
        timeTakenMs,
        pointsAwarded,
        isCorrect,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quizAnswers", "mine", sessionId] });
    },
  });

  return {
    session,
    currentQuestion,
    myAnswer: myAnswerQuery.data ?? null,
    myScore,
    isLoading: sessionQuery.isLoading,
    submitAnswer,
  };
}

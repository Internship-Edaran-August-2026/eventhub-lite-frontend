import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizSessionService } from "@/features/games/api/quizSessionService";
import { quizQuestionService } from "@/features/games/api/quizQuestionService";
import { quizAnswerService } from "@/features/games/api/quizAnswerService";
import { tallyAnswers } from "@/features/games/lib/tally";

/**
 * Host-side hook driving one live quiz session: polls the session document
 * every second (json-server has no websockets/SSE) and exposes the state
 * transitions a presenter screen needs — start, reveal, leaderboard, next.
 */
export function useQuizSession(sessionId: string | undefined) {
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

  const questions = useMemo(() => {
    if (!session || !questionsQuery.data) return [];
    const byId = new Map(questionsQuery.data.map((q) => [q.id, q]));
    return session.questionIds.map((id) => byId.get(id)).filter((q) => q !== undefined);
  }, [session, questionsQuery.data]);

  const currentQuestion = session ? questions[session.currentQuestionIndex] : undefined;

  const invalidateSession = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["gameSessions", sessionId] });
  }, [queryClient, sessionId]);

  const startGame = useMutation({
    mutationFn: () =>
      quizSessionService.update(sessionId!, {
        status: "QUESTION_ACTIVE",
        currentQuestionIndex: 0,
        questionStartedAt: new Date().toISOString(),
      }),
    onSuccess: invalidateSession,
  });

  const revealAnswer = useMutation({
    mutationFn: async () => {
      if (!session || !currentQuestion) throw new Error("No active question.");
      const answers = await quizAnswerService.listForQuestion(session.id, session.currentQuestionIndex);

      const scoreDeltas = new Map<string, number>();
      for (const answer of answers) {
        if (answer.isCorrect) {
          scoreDeltas.set(answer.playerId, (scoreDeltas.get(answer.playerId) ?? 0) + answer.pointsAwarded);
        }
      }

      const updatedPlayers = session.activePlayers.map((player) => ({
        ...player,
        score: player.score + (scoreDeltas.get(player.id) ?? 0),
      }));

      await quizSessionService.update(session.id, {
        status: "REVEAL_ANSWER",
        activePlayers: updatedPlayers,
      });

      return tallyAnswers(answers);
    },
    onSuccess: invalidateSession,
  });

  const showLeaderboard = useMutation({
    mutationFn: () => quizSessionService.update(sessionId!, { status: "LEADERBOARD" }),
    onSuccess: invalidateSession,
  });

  const nextQuestion = useMutation({
    mutationFn: () => {
      if (!session) throw new Error("No active session.");
      const nextIndex = session.currentQuestionIndex + 1;
      if (nextIndex >= session.questionIds.length) {
        return quizSessionService.update(session.id, { status: "FINISHED" });
      }
      return quizSessionService.update(session.id, {
        status: "QUESTION_ACTIVE",
        currentQuestionIndex: nextIndex,
        questionStartedAt: new Date().toISOString(),
      });
    },
    onSuccess: invalidateSession,
  });

  return {
    session,
    questions,
    currentQuestion,
    isLoading: sessionQuery.isLoading || questionsQuery.isLoading,
    startGame,
    revealAnswer,
    showLeaderboard,
    nextQuestion,
  };
}

import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { Users, ArrowRight, Play, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GameBadge } from "@/features/games/components/GameBadge";
import { PlayerAvatar } from "@/features/games/components/PlayerAvatar";
import { Leaderboard } from "@/features/games/components/Leaderboard";
import { Timer } from "@/features/games/components/Timer";
import { AnswerBarChart } from "@/features/games/modules/quiz/components/AnswerBarChart";
import { useQuizSession } from "@/features/games/modules/quiz/hooks/useQuizSession";
import { quizAnswerService } from "@/features/games/api/quizAnswerService";
import { tallyAnswers } from "@/features/games/lib/tally";

export function QuizHostPresenter() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { session, questions, currentQuestion, isLoading, startGame, revealAnswer, showLeaderboard, nextQuestion } =
    useQuizSession(sessionId);

  const answersQuery = useQuery({
    queryKey: ["quizAnswers", "forQuestion", sessionId, session?.currentQuestionIndex],
    queryFn: () => quizAnswerService.listForQuestion(sessionId!, session!.currentQuestionIndex),
    enabled: !!sessionId && session !== undefined && (session?.status === "QUESTION_ACTIVE" || session?.status === "REVEAL_ANSWER"),
    refetchInterval: 1000,
  });

  const handleTimeExpire = useCallback(() => {
    revealAnswer.mutate();
  }, [revealAnswer]);

  if (isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-8">
        <Skeleton className="h-64 w-full max-w-xl" />
      </div>
    );
  }

  const joinUrl = `${window.location.origin}/games/join?pin=${session.pinCode}`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 p-6 text-white sm:p-10">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" className="text-white hover:bg-white/10" onClick={() => navigate(-1)}>
            <Home className="mr-1 size-4" />
            Exit
          </Button>
          <GameBadge status={session.status} />
        </div>

        {session.status === "LOBBY" && (
          <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="items-center justify-center bg-white/5 text-center text-white ring-white/10">
              <CardHeader>
                <CardTitle className="text-white">Scan to Join</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-4">
                <div className="rounded-xl bg-white p-4">
                  <QRCodeSVG value={joinUrl} size={200} />
                </div>
                <div>
                  <p className="text-sm text-white/60">Game PIN</p>
                  <p className="text-5xl font-bold tracking-[0.3em]">{session.pinCode}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 text-white ring-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Users className="size-5" />
                  Players Joined ({session.activePlayers.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-3">
                  {session.activePlayers.map((player) => (
                    <div key={player.id} className="flex flex-col items-center gap-1">
                      <PlayerAvatar nickname={player.nickname} size="lg" />
                      <span className="max-w-16 truncate text-xs">{player.nickname}</span>
                    </div>
                  ))}
                  {session.activePlayers.length === 0 && (
                    <p className="text-sm text-white/50">Waiting for players to join...</p>
                  )}
                </div>
                <Button
                  size="lg"
                  className="w-full"
                  disabled={session.activePlayers.length === 0 || startGame.isPending}
                  onClick={() => startGame.mutate()}
                >
                  <Play className="mr-1 size-4" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {session.status === "QUESTION_ACTIVE" && currentQuestion && (
          <div className="flex flex-1 flex-col gap-6">
            <p className="text-center text-sm text-white/60">
              Question {session.currentQuestionIndex + 1} of {questions.length}
            </p>
            <Card className="flex-1 items-center justify-center bg-white/5 text-center text-white ring-white/10">
              <CardContent className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
                {currentQuestion.imageUrl && (
                  <img
                    src={currentQuestion.imageUrl}
                    alt=""
                    className="max-h-64 rounded-lg object-contain"
                  />
                )}
                <h2 className="text-3xl font-bold">{currentQuestion.questionText}</h2>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white/10 px-4 py-3 text-sm font-medium ring-1 ring-white/10"
                >
                  {option}
                </div>
              ))}
            </div>
            {session.questionStartedAt && (
              <Timer
                key={session.questionStartedAt}
                startedAt={session.questionStartedAt}
                totalSeconds={currentQuestion.timeLimitSeconds}
                onExpire={handleTimeExpire}
                className="[&_span]:text-white"
              />
            )}
            <p className="text-center text-sm text-white/60">
              {answersQuery.data?.length ?? 0} of {session.activePlayers.length} answered
            </p>
          </div>
        )}

        {session.status === "REVEAL_ANSWER" && currentQuestion && (
          <div className="flex flex-1 flex-col justify-center gap-6">
            <h2 className="text-center text-2xl font-bold">{currentQuestion.questionText}</h2>
            <Card className="bg-white/5 text-white ring-white/10">
              <CardContent className="pt-6">
                <AnswerBarChart
                  options={currentQuestion.options}
                  tally={tallyAnswers(answersQuery.data ?? [])}
                  correctOptionIndex={currentQuestion.correctOptionIndex}
                />
              </CardContent>
            </Card>
            <Button size="lg" onClick={() => showLeaderboard.mutate()} disabled={showLeaderboard.isPending}>
              <ArrowRight className="mr-1 size-4" />
              Show Leaderboard
            </Button>
          </div>
        )}

        {session.status === "LEADERBOARD" && (
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6">
            <h2 className="text-center text-2xl font-bold">Leaderboard</h2>
            <Leaderboard players={session.activePlayers} />
            <Button size="lg" onClick={() => nextQuestion.mutate()} disabled={nextQuestion.isPending}>
              {session.currentQuestionIndex + 1 >= questions.length ? "Show Final Results" : "Next Question"}
              <ArrowRight className="ml-1 size-4" />
            </Button>
          </div>
        )}

        {session.status === "FINISHED" && (
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6">
            <h2 className="text-center text-3xl font-bold">🎉 Final Results</h2>
            <Leaderboard players={session.activePlayers} />
            <Button size="lg" variant="outline" onClick={() => navigate("/games")}>
              Back to Games Hub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

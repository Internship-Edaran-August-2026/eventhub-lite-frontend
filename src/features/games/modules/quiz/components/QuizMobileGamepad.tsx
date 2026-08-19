import { useParams } from "react-router-dom";
import { Circle, Diamond, Square, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayerAvatar } from "@/features/games/components/PlayerAvatar";
import { useQuizPlayer } from "@/features/games/modules/quiz/hooks/useQuizPlayer";
import type { QuizOptionIndex } from "@/features/games/types/quiz.types";

const GAMEPAD_BUTTONS: { icon: typeof Triangle; className: string }[] = [
  { icon: Triangle, className: "bg-red-500 active:bg-red-600" },
  { icon: Diamond, className: "bg-blue-500 active:bg-blue-600" },
  { icon: Circle, className: "bg-yellow-500 active:bg-yellow-600" },
  { icon: Square, className: "bg-green-500 active:bg-green-600" },
];

export function QuizMobileGamepad() {
  const { sessionId, playerId } = useParams<{ sessionId: string; playerId: string }>();
  const { session, currentQuestion, myAnswer, myScore, isLoading, submitAnswer } = useQuizPlayer(
    sessionId,
    playerId
  );

  if (isLoading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
        <Skeleton className="h-48 w-full max-w-sm" />
      </div>
    );
  }

  const me = session.activePlayers.find((p) => p.id === playerId);
  const hasAnswered = myAnswer !== null;

  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-white">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <PlayerAvatar nickname={me?.nickname ?? "?"} size="sm" />
          <span className="text-sm font-medium">{me?.nickname}</span>
        </div>
        <span className="text-sm font-semibold tabular-nums">{myScore.toLocaleString()} pts</span>
      </div>

      {session.status === "LOBBY" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          <PlayerAvatar nickname={me?.nickname ?? "?"} size="lg" />
          <p className="text-lg font-semibold">You're in!</p>
          <p className="text-sm text-white/60">Waiting for the host to start the game...</p>
        </div>
      )}

      {session.status === "QUESTION_ACTIVE" && currentQuestion && (
        <div className="grid flex-1 grid-cols-2 gap-2 p-2">
          {GAMEPAD_BUTTONS.map(({ icon: Icon, className }, index) => (
            <button
              key={index}
              type="button"
              disabled={hasAnswered || submitAnswer.isPending}
              onClick={() => submitAnswer.mutate(index as QuizOptionIndex)}
              className={cn(
                "flex items-center justify-center rounded-xl text-white transition-transform active:scale-95 disabled:opacity-40",
                className
              )}
            >
              <Icon className="size-16" fill="currentColor" strokeWidth={1} />
            </button>
          ))}
        </div>
      )}

      {session.status === "QUESTION_ACTIVE" && hasAnswered && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/90">
          <p className="text-xl font-semibold">Answer locked in!</p>
        </div>
      )}

      {(session.status === "REVEAL_ANSWER" || session.status === "LEADERBOARD") && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
          {myAnswer === null ? (
            <>
              <p className="text-3xl">⏱️</p>
              <p className="text-xl font-bold">Time's Up!</p>
            </>
          ) : myAnswer.isCorrect ? (
            <>
              <p className="text-3xl">✅</p>
              <p className="text-xl font-bold text-emerald-400">Correct! +{myAnswer.pointsAwarded} pts</p>
            </>
          ) : (
            <>
              <p className="text-3xl">❌</p>
              <p className="text-xl font-bold text-rose-400">Wrong!</p>
            </>
          )}
          {session.status === "LEADERBOARD" && (
            <p className="text-sm text-white/60">Check the big screen for the leaderboard.</p>
          )}
        </div>
      )}

      {session.status === "FINISHED" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center">
          <p className="text-3xl">🎉</p>
          <p className="text-xl font-bold">Thanks for playing!</p>
          <p className="text-sm text-white/60">Final score: {myScore.toLocaleString()} pts</p>
        </div>
      )}
    </div>
  );
}

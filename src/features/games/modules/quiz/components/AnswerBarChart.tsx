import { cn } from "@/lib/utils";
import { QUIZ_OPTION_LABELS } from "@/features/games/types/quiz.types";
import type { QuizAnswerTally, QuizOptionIndex } from "@/features/games/types/quiz.types";

const OPTION_COLOR = ["bg-rose-500", "bg-blue-500", "bg-amber-500", "bg-emerald-500"];

interface AnswerBarChartProps {
  options: [string, string, string, string];
  tally: QuizAnswerTally[];
  correctOptionIndex?: QuizOptionIndex;
}

export function AnswerBarChart({ options, tally, correctOptionIndex }: AnswerBarChartProps) {
  const maxCount = Math.max(1, ...tally.map((t) => t.count));

  return (
    <div className="space-y-3">
      {options.map((text, index) => {
        const count = tally.find((t) => t.optionIndex === index)?.count ?? 0;
        const percent = (count / maxCount) * 100;
        const isCorrect = correctOptionIndex === index;

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm font-medium">
              <span className={cn(isCorrect && "text-emerald-500")}>
                {QUIZ_OPTION_LABELS[index]}. {text} {isCorrect && "✓"}
              </span>
              <span className="tabular-nums text-muted-foreground">{count}</span>
            </div>
            <div className="h-6 w-full overflow-hidden rounded-md bg-muted">
              <div
                className={cn("h-full transition-all duration-500", OPTION_COLOR[index])}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

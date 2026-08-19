import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QUIZ_OPTION_LABELS } from "@/features/games/types/quiz.types";
import type { QuizQuestion, QuizQuestionFormValues } from "@/features/games/types/quiz.types";

const questionSchema = z.object({
  questionText: z.string().min(3, "Question must be at least 3 characters."),
  imageUrl: z.string().optional().or(z.literal("")),
  option0: z.string().min(1, "Option A is required."),
  option1: z.string().min(1, "Option B is required."),
  option2: z.string().min(1, "Option C is required."),
  option3: z.string().min(1, "Option D is required."),
  correctOptionIndex: z.enum(["0", "1", "2", "3"]),
  timeLimitSeconds: z.number().int().min(5, "Minimum 5 seconds.").max(120, "Maximum 120 seconds."),
});

type QuestionFormSchema = z.infer<typeof questionSchema>;

interface QuestionFormProps {
  eventId: string;
  order: number;
  defaultValues?: QuizQuestion;
  onSubmit: (values: QuizQuestionFormValues) => Promise<void>;
  submitLabel: string;
}

export function QuestionForm({ eventId, order, defaultValues, onSubmit, submitLabel }: QuestionFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuestionFormSchema>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      questionText: defaultValues?.questionText ?? "",
      imageUrl: defaultValues?.imageUrl ?? "",
      option0: defaultValues?.options[0] ?? "",
      option1: defaultValues?.options[1] ?? "",
      option2: defaultValues?.options[2] ?? "",
      option3: defaultValues?.options[3] ?? "",
      correctOptionIndex: String(defaultValues?.correctOptionIndex ?? 0) as QuestionFormSchema["correctOptionIndex"],
      timeLimitSeconds: defaultValues?.timeLimitSeconds ?? 20,
    },
  });

  const correctOptionIndex = watch("correctOptionIndex");

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit({
      eventId,
      order,
      questionText: values.questionText,
      imageUrl: values.imageUrl || undefined,
      options: [values.option0, values.option1, values.option2, values.option3],
      correctOptionIndex: Number(values.correctOptionIndex) as QuizQuestionFormValues["correctOptionIndex"],
      timeLimitSeconds: values.timeLimitSeconds,
    });
  });

  return (
    <form className="space-y-4" onSubmit={submitHandler}>
      <div className="space-y-2">
        <Label htmlFor="questionText">Question</Label>
        <Textarea id="questionText" rows={3} {...register("questionText")} />
        {errors.questionText && (
          <p className="text-sm text-destructive">{errors.questionText.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Image URL (optional)</Label>
        <Input id="imageUrl" placeholder="https://..." {...register("imageUrl")} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(["option0", "option1", "option2", "option3"] as const).map((field, index) => (
          <div className="space-y-2" key={field}>
            <Label htmlFor={field}>Option {QUIZ_OPTION_LABELS[index]}</Label>
            <Input id={field} {...register(field)} />
            {errors[field] && <p className="text-sm text-destructive">{errors[field]?.message}</p>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Correct Option</Label>
          <Select
            value={correctOptionIndex}
            onValueChange={(value) => setValue("correctOptionIndex", value as QuestionFormSchema["correctOptionIndex"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {QUIZ_OPTION_LABELS.map((label, index) => (
                <SelectItem key={label} value={String(index)}>
                  Option {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeLimitSeconds">Time Limit (seconds)</Label>
          <Input
            id="timeLimitSeconds"
            type="number"
            {...register("timeLimitSeconds", { valueAsNumber: true })}
          />
          {errors.timeLimitSeconds && (
            <p className="text-sm text-destructive">{errors.timeLimitSeconds.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}

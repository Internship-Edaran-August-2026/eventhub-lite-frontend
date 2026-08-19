import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Rocket, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { eventService } from "@/services/eventService";
import { quizQuestionService } from "@/features/games/api/quizQuestionService";
import { quizSessionService } from "@/features/games/api/quizSessionService";
import { useAuth } from "@/contexts/AuthContext";
import { QuestionForm } from "@/features/games/modules/quiz/components/QuestionForm";
import type { QuizQuestion, QuizQuestionFormValues } from "@/features/games/types/quiz.types";

export function QuizAdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const eventId = searchParams.get("eventId") ?? "";
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | "new" | null>(null);

  const eventsQuery = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.list(1, 100),
  });

  const questionsQuery = useQuery({
    queryKey: ["quizQuestions", "byEvent", eventId],
    queryFn: () => quizQuestionService.listByEvent(eventId),
    enabled: !!eventId,
  });

  const invalidateQuestions = () =>
    queryClient.invalidateQueries({ queryKey: ["quizQuestions", "byEvent", eventId] });

  const createQuestion = useMutation({
    mutationFn: (values: QuizQuestionFormValues) => quizQuestionService.create(values),
    onSuccess: () => {
      invalidateQuestions();
      toast.success("Question added.");
      setEditingQuestion(null);
    },
    onError: () => toast.error("Failed to add question."),
  });

  const updateQuestion = useMutation({
    mutationFn: ({ id, values }: { id: string; values: QuizQuestionFormValues }) =>
      quizQuestionService.update(id, values),
    onSuccess: () => {
      invalidateQuestions();
      toast.success("Question updated.");
      setEditingQuestion(null);
    },
    onError: () => toast.error("Failed to update question."),
  });

  const deleteQuestion = useMutation({
    mutationFn: (id: string) => quizQuestionService.remove(id),
    onSuccess: () => {
      invalidateQuestions();
      toast.success("Question deleted.");
    },
    onError: () => toast.error("Failed to delete question."),
  });

  const startGame = useMutation({
    mutationFn: async () => {
      if (!eventId || !questionsQuery.data?.length) {
        throw new Error("Add at least one question before starting.");
      }
      const questionIds = questionsQuery.data.map((q) => q.id);
      return quizSessionService.create(eventId, user?.id ?? "unknown", questionIds);
    },
    onSuccess: (session) => navigate(`/games/host/${session.id}`),
    onError: (error: Error) => toast.error(error.message || "Failed to start game."),
  });

  const questions = useMemo(
    () => [...(questionsQuery.data ?? [])].sort((a, b) => a.order - b.order),
    [questionsQuery.data]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Live Quiz &amp; Trivia</h1>
          <p className="text-muted-foreground">Manage the question bank and launch a live session.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={eventId}
            onValueChange={(value) => setSearchParams({ eventId: value })}
          >
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select an event" />
            </SelectTrigger>
            <SelectContent>
              {eventsQuery.data?.data.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => startGame.mutate()}
            disabled={!eventId || startGame.isPending}
          >
            <Rocket className="mr-1 size-4" />
            Start Live Game
          </Button>
        </div>
      </div>

      {!eventId && (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Select an event to manage its quiz question bank.
        </p>
      )}

      {eventId && (
        <>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setEditingQuestion("new")}>
              <Plus className="mr-1 size-4" />
              Add Question
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Correct Answer</TableHead>
                  <TableHead>Time Limit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questionsQuery.isLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}

                {questions.map((question, index) => (
                  <TableRow key={question.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="max-w-md truncate font-medium">{question.questionText}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{question.options[question.correctOptionIndex]}</Badge>
                    </TableCell>
                    <TableCell>{question.timeLimitSeconds}s</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon-sm" onClick={() => setEditingQuestion(question)}>
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deleteQuestion.mutate(question.id)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {!questionsQuery.isLoading && questions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No questions yet. Add your first question to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <Dialog open={editingQuestion !== null} onOpenChange={(open) => !open && setEditingQuestion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingQuestion === "new" ? "Add Question" : "Edit Question"}</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <QuestionForm
              eventId={eventId}
              order={editingQuestion === "new" ? questions.length : editingQuestion.order}
              defaultValues={editingQuestion === "new" ? undefined : editingQuestion}
              submitLabel={editingQuestion === "new" ? "Add Question" : "Save Changes"}
              onSubmit={(values) =>
                editingQuestion === "new"
                  ? createQuestion.mutateAsync(values).then(() => {})
                  : updateQuestion.mutateAsync({ id: editingQuestion.id, values }).then(() => {})
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

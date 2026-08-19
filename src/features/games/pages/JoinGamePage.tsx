import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useJoinQuizSession } from "@/features/games/modules/quiz/hooks/useQuizPlayer";

const joinSchema = z.object({
  pinCode: z.string().length(4, "PIN must be 4 digits.").regex(/^\d+$/, "PIN must be numeric."),
  nickname: z.string().min(2, "Nickname must be at least 2 characters.").max(16, "Keep it under 16 characters."),
});

type JoinFormValues = z.infer<typeof joinSchema>;

export function JoinGamePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const joinSession = useJoinQuizSession();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinFormValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      pinCode: searchParams.get("pin") ?? "",
      nickname: "",
    },
  });

  const onSubmit = handleSubmit(async ({ pinCode, nickname }) => {
    try {
      const { session, player } = await joinSession.mutateAsync({ pinCode, nickname });
      navigate(`/games/play/${session.id}/${player.id}`);
    } catch {
      // surfaced via joinSession.error below
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Gamepad2 className="size-6" />
          </div>
          <CardTitle>Join a Live Game</CardTitle>
          <CardDescription>Enter the PIN shown on the host screen.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="pinCode">Game PIN</Label>
              <Input
                id="pinCode"
                inputMode="numeric"
                maxLength={4}
                className="text-center text-2xl tracking-[0.5em]"
                {...register("pinCode")}
              />
              {errors.pinCode && <p className="text-sm text-destructive">{errors.pinCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input id="nickname" autoComplete="off" {...register("nickname")} />
              {errors.nickname && <p className="text-sm text-destructive">{errors.nickname.message}</p>}
            </div>

            {joinSession.isError && (
              <p className="text-sm text-destructive">
                {(joinSession.error as Error).message || "Unable to join. Check the PIN and try again."}
              </p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || joinSession.isPending}>
              Join Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

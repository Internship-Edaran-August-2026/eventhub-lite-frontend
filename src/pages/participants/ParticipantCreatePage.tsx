import { useNavigate } from "react-router-dom";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  participantService,
  type ParticipantFormValues,
} from "@/services/participantService";

import { ParticipantForm } from "./ParticipantForm";

export function ParticipantCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (values: ParticipantFormValues) =>
      participantService.create(values),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["participants"],
      });

      toast.success("Participant added successfully.");

      navigate("/participants");
    },

    onError: () => {
      toast.error("Failed to add participant.");
    },
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Add Participant
        </h1>

        <p className="text-muted-foreground">
          Fill in the details below to add a new participant.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participant Details</CardTitle>
        </CardHeader>

        <CardContent>
          <ParticipantForm
            submitLabel="Add Participant"
            onSubmit={(values) => mutateAsync(values)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
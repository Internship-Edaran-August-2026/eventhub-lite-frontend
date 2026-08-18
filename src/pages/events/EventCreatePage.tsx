import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { eventService } from "@/services/eventService";
import type { EventFormValues } from "@/types/event";
import { EventForm } from "./EventForm";

export function EventCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: (values: EventFormValues) => eventService.create(values),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created successfully.");
      navigate(`/events/${event.id}`);
    },
    onError: () => toast.error("Failed to create event."),
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Create Event</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new event.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Event Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EventForm submitLabel="Create Event" onSubmit={(values) => mutateAsync(values).then(() => {})} />
        </CardContent>
      </Card>
    </div>
  );
}

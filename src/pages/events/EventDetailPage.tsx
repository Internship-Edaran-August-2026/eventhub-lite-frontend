import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { eventService } from "@/services/eventService";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  published: "default",
  draft: "secondary",
  ongoing: "default",
  completed: "outline",
  cancelled: "destructive",
};

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ["events", id],
    queryFn: () => eventService.get(id!),
    enabled: !!id,
  });

  const { mutateAsync: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: () => eventService.remove(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event deleted.");
      navigate("/events");
    },
    onError: () => toast.error("Failed to delete event."),
  });

  if (isLoading) {
    return <Skeleton className="h-64 w-full max-w-2xl" />;
  }

  if (!event) {
    return <p className="text-muted-foreground">Event not found.</p>;
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{event.title}</CardTitle>
            <Badge variant={STATUS_VARIANT[event.status] ?? "outline"} className="mt-2">
              {event.status}
            </Badge>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete this event?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                This will permanently remove "{event.title}". This action cannot be undone.
              </p>
              <DialogFooter>
                <Button variant="destructive" disabled={isDeleting} onClick={() => deleteEvent()}>
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm">{event.description}</p>

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Location</dt>
              <dd className="font-medium">{event.location}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Max Capacity</dt>
              <dd className="font-medium tabular-nums">{event.max_capacity}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Start Date</dt>
              <dd className="font-medium">{new Date(event.start_date).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">End Date</dt>
              <dd className="font-medium">{new Date(event.end_date).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">RSVPs</dt>
              <dd className="font-medium tabular-nums">{event.rsvps_count}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

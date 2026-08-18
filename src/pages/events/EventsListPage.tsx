import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { eventService } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  published: "default",
  draft: "secondary",
  ongoing: "default",
  completed: "outline",
  cancelled: "destructive",
};

export function EventsListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.list(1, 20),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-muted-foreground">Manage all events in the system.</p>
        </div>
        <Button asChild>
          <Link to="/events/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead className="text-right">RSVPs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-6 w-full" />
                  </TableCell>
                </TableRow>
              ))}

            {data?.data.map((event) => (
              <TableRow key={event.id} className="cursor-pointer">
                <TableCell className="font-medium">
                  <Link to={`/events/${event.id}`} className="hover:underline">
                    {event.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANT[event.status] ?? "outline"}>
                    {event.status}
                  </Badge>
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{new Date(event.start_date).toLocaleDateString()}</TableCell>
                <TableCell className="text-right tabular-nums">{event.rsvps_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

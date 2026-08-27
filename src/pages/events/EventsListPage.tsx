import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { eventService } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  published: "default",
  draft: "secondary",
  ongoing: "default",
  completed: "outline",
  cancelled: "destructive",
};

function EventDayButton(
  props: React.ComponentProps<typeof CalendarDayButton>
) {
  const { modifiers } = props;

  return (
    <div className="relative">
      <CalendarDayButton {...props} />

      {modifiers.event && (
        <span className="pointer-events-none absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
      )}
    </div>
  );
}

export function EventsListPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const { data, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.list(1, 100),
  });

  const events = data?.data ?? [];

  const eventDates = useMemo(
    () =>
      events.map((event) => {
        const date = new Date(event.start_date);

        return new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate()
        );
      }),
    [events]
  );

  const selectedEvents = selectedDate
    ? events.filter((event) => {
        const eventDate = new Date(event.start_date);

        return (
          eventDate.getFullYear() === selectedDate.getFullYear() &&
          eventDate.getMonth() === selectedDate.getMonth() &&
          eventDate.getDate() === selectedDate.getDate()
        );
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Events</h1>
          <p className="text-muted-foreground">
            Manage all events in the system.
          </p>
        </div>

        <Button asChild>
          <Link to="/events/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Calendar Section */}
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
          </CardHeader>

          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={{
                event: eventDates,
              }}
              modifiersClassNames={{
                event: "font-semibold text-primary",
              }}
              components={{
                DayButton: EventDayButton,
              }}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        {/* Selected Date Events */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate?.toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                Loading events...
              </p>
            ) : selectedEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No events scheduled for this date.
              </p>
            ) : (
              <div className="space-y-3">
                {selectedEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${event.id}`}
                    className="block rounded-lg border p-3 transition hover:bg-muted"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium">{event.title}</h3>

                      <Badge variant="outline">{event.status}</Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {event.location}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(event.start_date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Existing Events Table */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">All Events</h2>

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

              {events.map((event) => (
                <TableRow key={event.id} className="cursor-pointer">
                  <TableCell className="font-medium">
                    <Link
                      to={`/events/${event.id}`}
                      className="hover:underline"
                    >
                      {event.title}
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={STATUS_VARIANT[event.status] ?? "outline"}
                    >
                      {event.status}
                    </Badge>
                  </TableCell>

                  <TableCell>{event.location}</TableCell>

                  <TableCell>
                    {new Date(event.start_date).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="text-right tabular-nums">
                    {event.rsvps_count}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
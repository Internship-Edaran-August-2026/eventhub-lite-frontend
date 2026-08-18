import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { dashboardService } from "@/services/dashboardService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  published: "default",
  draft: "secondary",
  ongoing: "default",
  completed: "outline",
  cancelled: "destructive",
};

export function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: dashboardService.getStats,
  });

  const stats = [
    { label: "Total Events", value: data?.total_events },
    { label: "Total Participants", value: data?.total_participants },
    { label: "Upcoming Events", value: data?.upcoming_events },
    { label: "Checked In Today", value: data?.checked_in_today },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your events and participants.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-semibold tabular-nums">{stat.value}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading && <Skeleton className="h-32 w-full" />}
          {data?.recent_events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="flex items-center justify-between rounded-md border p-3 hover:bg-accent transition-colors"
            >
              <div>
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.start_date).toLocaleDateString()} &middot; {event.rsvps_count}{" "}
                  RSVPs
                </p>
              </div>
              <Badge variant={STATUS_VARIANT[event.status] ?? "outline"}>{event.status}</Badge>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

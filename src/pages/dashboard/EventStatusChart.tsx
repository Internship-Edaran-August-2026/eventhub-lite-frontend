import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import type { EventItem, EventStatus } from "@/types/event";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface EventStatusChartProps {
  events: EventItem[];
}

const STATUS_ORDER: EventStatus[] = [
  "draft",
  "published",
  "ongoing",
  "completed",
  "cancelled",
];

const STATUS_LABELS: Record<EventStatus, string> = {
  draft: "Draft",
  published: "Published",
  ongoing: "Ongoing",
  completed: "Completed",
  cancelled: "Cancelled",
};

const chartConfig = {
  events: {
    label: "Events",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function EventStatusChart({
  events,
}: EventStatusChartProps) {
  const statusCounts = STATUS_ORDER.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: events.filter((event) => event.status === status).length,
  }));

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Event Status</h2>
        <p className="text-sm text-muted-foreground">
          Number of events by current status.
        </p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="min-h-[280px] w-full"
      >
        <BarChart
          accessibilityLayer
          data={statusCounts}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid vertical={false} />

          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />

          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={30}
          />

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />

          <Bar
            dataKey="count"
            name="Events"
            fill="var(--color-events)"
            radius={6}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
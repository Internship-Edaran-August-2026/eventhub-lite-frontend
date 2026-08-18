import type { DashboardStats } from "@/types/dashboard";
import { MOCK_EVENTS } from "./events";

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_events: MOCK_EVENTS.length,
  total_participants: 631,
  upcoming_events: MOCK_EVENTS.filter((e) => e.status === "published").length,
  checked_in_today: 76,
  recent_events: MOCK_EVENTS.slice(0, 4).map((e) => ({
    id: e.id,
    title: e.title,
    status: e.status,
    start_date: e.start_date,
    rsvps_count: e.rsvps_count ?? 0,
  })),
};

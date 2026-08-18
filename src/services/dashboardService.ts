import { apiClient } from "@/api/client";
import type { DashboardStats } from "@/types/dashboard";
import type { EventItem } from "@/types/event";
import type { Participant } from "@/types/participant";

export const dashboardService = {
  // json-server has no computed-stats endpoint, so we derive the dashboard
  // numbers client-side from the raw /events and /participants tables.
  async getStats(): Promise<DashboardStats> {
    const [{ data: events }, { data: participants }] = await Promise.all([
      apiClient.get<EventItem[]>("/events"),
      apiClient.get<Participant[]>("/participants"),
    ]);

    const today = new Date().toDateString();

    return {
      total_events: events.length,
      total_participants: participants.length,
      upcoming_events: events.filter((e) => e.status === "published").length,
      checked_in_today: participants.filter(
        (p) => p.status === "checked_in" && new Date(p.registered_at ?? "").toDateString() === today
      ).length,
      recent_events: events.slice(0, 4).map((e) => ({
        id: e.id,
        title: e.title,
        status: e.status,
        start_date: e.start_date,
        rsvps_count: e.rsvps_count ?? 0,
      })),
    };
  },
};

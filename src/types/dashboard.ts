export interface DashboardStats {
  total_events: number;
  total_participants: number;
  upcoming_events: number;
  checked_in_today: number;
  recent_events: Array<{
    id: string;
    title: string;
    status: string;
    start_date: string;
    rsvps_count: number;
  }>;
}

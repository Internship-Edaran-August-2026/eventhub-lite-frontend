export type EventStatus = "draft" | "published" | "ongoing" | "completed" | "cancelled";

export interface EventItem {
  id: string;
  title: string;
  description: string;
  status: EventStatus;
  location: string;
  organizer_id?: string;
  start_date: string; // ISO date
  end_date: string; // ISO date
  max_capacity: number;
  budget_total?: number;
  // Optional: json-server only stores what a form submits, so events
  // created through the app won't have these until you extend EventForm.
  rsvps_count?: number;
  created_at?: string;
  updated_at?: string;
}

/** Fields the create/edit form actually submits. */
export interface EventFormValues {
  title: string;
  description: string;
  location: string;
  status: EventStatus;
  start_date: string;
  end_date: string;
  max_capacity: number;
}

export type ParticipantType = "attendee" | "speaker" | "vip" | "staff";

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  event_id: string;
  event_title?: string;
  status: "invited" | "accepted" | "declined" | "checked_in";
  type?: ParticipantType;
  registered_at?: string;
}

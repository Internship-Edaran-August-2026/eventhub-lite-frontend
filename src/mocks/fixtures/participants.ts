import type { Participant } from "@/types/participant";

export const MOCK_PARTICIPANTS: Participant[] = [
  { id: "prt_001", name: "Nurul Aina", email: "nurul.aina@eventhubtest.com", phone: "012-3456789", event_id: "evt_001", event_title: "Annual Tech Conference 2026", status: "checked_in", registered_at: "2026-06-05T10:00:00Z" },
  { id: "prt_002", name: "Marcus Lim", email: "marcus.lim@eventhubtest.com", phone: "013-2345678", event_id: "evt_001", event_title: "Annual Tech Conference 2026", status: "accepted", registered_at: "2026-06-06T11:00:00Z" },
  { id: "prt_003", name: "Siti Rahman", email: "siti.rahman@eventhubtest.com", phone: "014-3456781", event_id: "evt_001", event_title: "Annual Tech Conference 2026", status: "invited", registered_at: "2026-06-07T09:30:00Z" },
  { id: "prt_004", name: "Wei Jian Ong", email: "weijian.ong@eventhubtest.com", phone: "016-7788990", event_id: "evt_003", event_title: "Customer Appreciation Night", status: "checked_in", registered_at: "2026-03-10T08:00:00Z" },
  { id: "prt_005", name: "Priya Sundram", email: "priya.sundram@eventhubtest.com", phone: "017-6655443", event_id: "evt_003", event_title: "Customer Appreciation Night", status: "checked_in", registered_at: "2026-03-11T08:00:00Z" },
  { id: "prt_006", name: "Farid Iskandar", email: "farid.iskandar@eventhubtest.com", phone: "019-1122334", event_id: "evt_004", event_title: "Internal Hackathon", status: "accepted", registered_at: "2026-06-20T08:00:00Z" },
  { id: "prt_007", name: "Grace Tan", email: "grace.tan@eventhubtest.com", phone: "011-9988776", event_id: "evt_004", event_title: "Internal Hackathon", status: "declined", registered_at: "2026-06-21T08:00:00Z" },
];

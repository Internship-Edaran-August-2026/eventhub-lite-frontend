import { http, HttpResponse } from "msw";
import type { ApiResponse, PaginatedData } from "@/types/shared";
import type { EventItem, EventFormValues } from "@/types/event";
import { MOCK_EVENTS } from "../fixtures/events";

// In-memory copy so create/update/delete persist for the lifetime of the tab.
let events: EventItem[] = [...MOCK_EVENTS];
let nextId = events.length + 1;

export const eventHandlers = [
  http.get("/api/events", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const perPage = Number(url.searchParams.get("per_page") ?? "10");

    const start = (page - 1) * perPage;
    const pageItems = events.slice(start, start + perPage);

    const response: ApiResponse<PaginatedData<EventItem>> = {
      success: true,
      message: "Events retrieved.",
      data: {
        data: pageItems,
        meta: {
          current_page: page,
          last_page: Math.ceil(events.length / perPage) || 1,
          per_page: perPage,
          total: events.length,
        },
      },
    };
    return HttpResponse.json(response);
  }),

  http.get("/api/events/:id", ({ params }) => {
    const event = events.find((e) => e.id === params.id);
    if (!event) {
      return HttpResponse.json({ success: false, message: "Event not found." }, { status: 404 });
    }
    const response: ApiResponse<EventItem> = {
      success: true,
      message: "Event retrieved.",
      data: event,
    };
    return HttpResponse.json(response);
  }),

  http.post("/api/events", async ({ request }) => {
    const body = (await request.json()) as EventFormValues;
    const now = "2026-08-18T00:00:00Z";
    const newEvent: EventItem = {
      id: `evt_${String(nextId++).padStart(3, "0")}`,
      rsvps_count: 0,
      created_at: now,
      updated_at: now,
      ...body,
    };
    events = [newEvent, ...events];

    const response: ApiResponse<EventItem> = {
      success: true,
      message: "Event created.",
      data: newEvent,
    };
    return HttpResponse.json(response, { status: 201 });
  }),

  http.put("/api/events/:id", async ({ params, request }) => {
    const body = (await request.json()) as EventFormValues;
    const index = events.findIndex((e) => e.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ success: false, message: "Event not found." }, { status: 404 });
    }
    events[index] = { ...events[index], ...body, updated_at: "2026-08-18T00:00:00Z" };

    const response: ApiResponse<EventItem> = {
      success: true,
      message: "Event updated.",
      data: events[index],
    };
    return HttpResponse.json(response);
  }),

  http.delete("/api/events/:id", ({ params }) => {
    const index = events.findIndex((e) => e.id === params.id);
    if (index === -1) {
      return HttpResponse.json({ success: false, message: "Event not found." }, { status: 404 });
    }
    events = events.filter((e) => e.id !== params.id);

    return HttpResponse.json({ success: true, message: "Event deleted.", data: null });
  }),
];

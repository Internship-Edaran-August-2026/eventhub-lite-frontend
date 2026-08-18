import { apiClient } from "@/api/client";
import { paginate } from "@/lib/paginate";
import type { PaginatedData } from "@/types/shared";
import type { EventItem, EventFormValues } from "@/types/event";

export const eventService = {
  async list(page = 1, perPage = 10): Promise<PaginatedData<EventItem>> {
    const { data } = await apiClient.get<EventItem[]>("/events");
    return paginate(data, page, perPage);
  },

  async get(id: string): Promise<EventItem> {
    const { data } = await apiClient.get<EventItem>(`/events/${id}`);
    return data;
  },

  async create(values: EventFormValues): Promise<EventItem> {
    const { data } = await apiClient.post<EventItem>("/events", values);
    return data;
  },

  async update(id: string, values: EventFormValues): Promise<EventItem> {
    const { data } = await apiClient.put<EventItem>(`/events/${id}`, values);
    return data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/events/${id}`);
  },
};

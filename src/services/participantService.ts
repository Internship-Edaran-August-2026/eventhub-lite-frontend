import { apiClient } from "@/api/client";
import { paginate } from "@/lib/paginate";
import type { PaginatedData } from "@/types/shared";
import type { Participant } from "@/types/participant";

export type ParticipantFormValues = {
  name: string;
  email: string;
  phone: string;
  event_id: string;
  type: Participant["type"];
  status: Participant["status"];
  registered_at: string;
};

export const participantService = {
  async list(page = 1, perPage = 10): Promise<PaginatedData<Participant>> {
    const { data } = await apiClient.get<Participant[]>("/participants");
    return paginate(data, page, perPage);
  },

  async create(values: ParticipantFormValues): Promise<Participant> {
    const { data } = await apiClient.post<Participant>(
      "/participants",
      values
    );
    return data;
  },
};
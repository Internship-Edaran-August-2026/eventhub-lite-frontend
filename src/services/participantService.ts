import { apiClient } from "@/api/client";
import { paginate } from "@/lib/paginate";
import type { PaginatedData } from "@/types/shared";
import type { Participant } from "@/types/participant";

export const participantService = {
  async list(page = 1, perPage = 10): Promise<PaginatedData<Participant>> {
    const { data } = await apiClient.get<Participant[]>("/participants");
    return paginate(data, page, perPage);
  },
};

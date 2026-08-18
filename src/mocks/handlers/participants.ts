import { http, HttpResponse } from "msw";
import type { ApiResponse, PaginatedData } from "@/types/shared";
import type { Participant } from "@/types/participant";
import { MOCK_PARTICIPANTS } from "../fixtures/participants";

export const participantHandlers = [
  http.get("/api/participants", ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const perPage = Number(url.searchParams.get("per_page") ?? "10");

    const start = (page - 1) * perPage;
    const pageItems = MOCK_PARTICIPANTS.slice(start, start + perPage);

    const response: ApiResponse<PaginatedData<Participant>> = {
      success: true,
      message: "Participants retrieved.",
      data: {
        data: pageItems,
        meta: {
          current_page: page,
          last_page: Math.ceil(MOCK_PARTICIPANTS.length / perPage),
          per_page: perPage,
          total: MOCK_PARTICIPANTS.length,
        },
      },
    };
    return HttpResponse.json(response);
  }),
];

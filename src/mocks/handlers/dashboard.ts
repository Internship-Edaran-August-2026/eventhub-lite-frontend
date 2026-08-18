import { http, HttpResponse } from "msw";
import type { ApiResponse } from "@/types/shared";
import type { DashboardStats } from "@/types/dashboard";
import { MOCK_DASHBOARD_STATS } from "../fixtures/dashboard";

export const dashboardHandlers = [
  http.get("/api/dashboard/stats", () => {
    const response: ApiResponse<DashboardStats> = {
      success: true,
      message: "Dashboard stats retrieved.",
      data: MOCK_DASHBOARD_STATS,
    };
    return HttpResponse.json(response);
  }),
];

import { http, HttpResponse } from "msw";
import type { LoginCredentials, LoginResponse } from "@/types/auth";
import type { ApiResponse } from "@/types/shared";
import { MOCK_TOKEN, MOCK_USER } from "../fixtures/auth";

export const authHandlers = [
  http.post("/api/login", async ({ request }) => {
    const body = (await request.json()) as LoginCredentials;

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 422 }
      );
    }

    const response: ApiResponse<LoginResponse> = {
      success: true,
      message: "Login successful.",
      data: { token: MOCK_TOKEN, user: MOCK_USER },
    };
    return HttpResponse.json(response);
  }),

  http.post("/api/logout", () => {
    return HttpResponse.json({ success: true, message: "Logged out.", data: null });
  }),
];

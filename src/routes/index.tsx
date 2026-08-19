import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "./RequireAuth";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { EventsListPage } from "@/pages/events/EventsListPage";
import { EventDetailPage } from "@/pages/events/EventDetailPage";
import { EventCreatePage } from "@/pages/events/EventCreatePage";
import { ParticipantsPage } from "@/pages/participants/ParticipantsPage";
import { GamesHubPage } from "@/features/games/pages/GamesHubPage";
import { QuizAdminDashboard } from "@/features/games/modules/quiz/components/QuizAdminDashboard";
import { QuizHostPresenter } from "@/features/games/modules/quiz/components/QuizHostPresenter";
import { JoinGamePage } from "@/features/games/pages/JoinGamePage";
import { QuizMobileGamepad } from "@/features/games/modules/quiz/components/QuizMobileGamepad";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Public participant flow — no auth, reached via QR code / PIN. */}
      <Route path="/games/join" element={<JoinGamePage />} />
      <Route path="/games/play/:sessionId/:playerId" element={<QuizMobileGamepad />} />

      {/* Full-screen projector view for the host — authenticated, no sidebar/header chrome. */}
      <Route
        path="/games/host/:sessionId"
        element={
          <RequireAuth>
            <QuizHostPresenter />
          </RequireAuth>
        }
      />

      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events" element={<EventsListPage />} />
        <Route path="/events/create" element={<EventCreatePage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/participants" element={<ParticipantsPage />} />
        <Route path="/games" element={<GamesHubPage />} />
        <Route path="/games/quiz-trivia" element={<QuizAdminDashboard />} />
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { RequireAuth } from "./RequireAuth";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { EventsListPage } from "@/pages/events/EventsListPage";
import { EventDetailPage } from "@/pages/events/EventDetailPage";
import { EventCreatePage } from "@/pages/events/EventCreatePage";
import { ParticipantsPage } from "@/pages/participants/ParticipantsPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

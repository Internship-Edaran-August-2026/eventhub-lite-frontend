import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function AppLayout() {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      <Sidebar />

      <div className="flex min-w-0 min-h-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="min-h-0 flex-1 overflow-y-auto overscroll-none bg-background p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
import { NavLink } from "react-router-dom";
import { LayoutDashboard, CalendarDays, Users, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Events", to: "/events", icon: CalendarDays },
  { label: "Participants", to: "/participants", icon: Users },
  { label: "Games", to: "/games", icon: Gamepad2 },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-brand-blue text-brand-white shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <span className="font-semibold text-lg">
          <span className="text-brand-gold">Event</span>Hub Lite
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-gold text-brand-blue"
                  : "text-brand-white/80 hover:bg-white/10 hover:text-brand-white"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

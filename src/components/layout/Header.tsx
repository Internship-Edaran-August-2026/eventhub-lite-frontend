import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumbs } from "./Breadcrumbs";

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="h-16 flex items-center justify-between border-b bg-brand-blue text-brand-white px-4 md:px-6 shrink-0">
      <Breadcrumbs />

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 rounded-full">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-brand-blue font-semibold text-sm">
            {initial}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled={isLoading} onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

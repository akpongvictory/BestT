import {
  Bell,
  LogOut,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Topbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  const firstName = user?.name?.split(" ")[0] || "Learner";

  return (
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      {/* Greeting */}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
          Your learning space
        </p>

        <h1 className="mt-1 truncate text-lg font-semibold tracking-tight text-[#0d1b3e] sm:text-xl">
          Welcome back, {firstName}
        </h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notifications"
          className="relative hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition-all duration-200 hover:bg-slate-50 hover:text-slate-900 sm:flex"
        >
          <Bell size={18} strokeWidth={1.9} />

          {/* Notification indicator */}
          <span
            aria-hidden="true"
            className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-blue-600 ring-2 ring-white"
          />
        </button>

        <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0d1b3e] text-white shadow-sm">
            <UserRound size={17} strokeWidth={1.8} />
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="max-w-[140px] truncate text-sm font-semibold text-[#0d1b3e]">
              {user?.name || "Learner"}
            </p>

            <p className="text-[11px] text-slate-400">
              Student
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            title="Sign out"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={17} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}
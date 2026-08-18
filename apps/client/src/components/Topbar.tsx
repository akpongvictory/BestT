import { Bell, LogOut, UserRound } from "lucide-react";
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
    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-medium text-slate-400">
          Your learning space
        </p>

        <h1 className="mt-0.5 text-lg font-semibold tracking-tight text-[#0d1b3e]">
          Welcome back, {firstName}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="hidden h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#0d1b3e] sm:flex"
          aria-label="Notifications"
        >
          <Bell size={18} strokeWidth={1.8} />
        </button>

        <div className="mx-1 hidden h-7 w-px bg-slate-200 sm:block" />

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/20">
            <UserRound size={18} />
          </div>

          <div className="hidden min-w-0 md:block">
            <p className="max-w-[130px] truncate text-sm font-semibold text-[#0d1b3e]">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-400">
              Student
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-red-50 hover:text-red-500"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut size={17} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </header>
  );
}
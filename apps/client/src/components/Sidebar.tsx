import { NavLink, type NavLinkRenderProps } from "react-router-dom";
import {
  FileText,
  LayoutDashboard,
  Settings,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Resources",
    path: "/resources",
    icon: FileText,
  },
  {
    name: "Upload Material",
    path: "/upload",
    icon: Upload,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: UserRound,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-20 items-center border-b border-slate-100 px-5">
        <img
          src="/bestt-logo.png"
          alt="BestT"
          className="h-11 w-auto object-contain"
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          Workspace
        </p>

        <div className="space-y-1.5">
          {links.map((link) => {
            const Icon = link.icon;

            return (
              <NavLink
                key={link.name}
                to={link.path}
                className="group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200"
              >
                {({ isActive }: NavLinkRenderProps) => (
                  <>
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-white text-blue-600 shadow-sm"
                          : "bg-slate-50 text-slate-500 group-hover:text-slate-700",
                      ].join(" ")}
                    >
                      <Icon size={18} strokeWidth={1.9} />
                    </span>

                    <span
                      className={
                        isActive
                          ? "text-blue-700"
                          : "text-slate-600 group-hover:text-slate-900"
                      }
                    >
                      {link.name}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Tutor card */}
      <div className="m-4 rounded-2xl bg-[#0d1b3e] p-4 text-white shadow-lg shadow-slate-200">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
        </div>

        <p className="text-sm font-semibold">BestT Tutor</p>

        <p className="mt-1 text-xs leading-5 text-slate-300">
          Your materials are ready. Ask questions, explore ideas and learn at
          your own pace.
        </p>
      </div>
    </aside>
  );
}
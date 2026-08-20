import {
  Bell,
  Lock,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();

    toast.success("You've been signed out.");

    navigate("/");
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        description="Manage your BestT account, notifications and security preferences."
      />

      <div className="max-w-3xl space-y-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Bell size={20} />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-[#0d1b3e]">
                Notifications
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Notification preferences will be available here as BestT
                introduces learning reminders and updates.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              Coming soon
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Lock size={20} />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-[#0d1b3e]">
                Password & security
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Password changes and additional security controls will live
                here.
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
              Coming soon
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="font-semibold text-[#0d1b3e]">
                Privacy
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                Your learning material and account information are kept within
                your personal BestT workspace.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-red-100 bg-red-50/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-red-900">
                Sign out
              </h2>

              <p className="mt-1 text-sm text-red-700/70">
                Sign out of your BestT account on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
              <LogOut size={17} />
              Sign out
            </button>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
import {
  Mail,
  UserRound,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/PageHeader";
import { useAuth } from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "Learner";

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Account"
        title="Your profile"
        description="Manage your BestT account information and personal learning identity."
      />

      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-2xl font-bold text-white shadow-xl shadow-blue-500/20">
              {firstName.charAt(0).toUpperCase()}
            </div>

            <h2 className="mt-5 text-xl font-semibold text-[#0d1b3e]">
              {user?.name || "Learner"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {user?.email}
            </p>

            <span className="mt-4 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
              Student
            </span>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
          <h2 className="text-lg font-semibold text-[#0d1b3e]">
            Account information
          </h2>

          <div className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Full name
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <UserRound size={18} className="text-slate-400" />

                <span className="text-sm font-medium text-slate-700">
                  {user?.name || "Not provided"}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-400">
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <Mail size={18} className="text-slate-400" />

                <span className="text-sm font-medium text-slate-700">
                  {user?.email || "Not provided"}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
import {
  BookOpen,
  FileText,
  Search,
  Upload,
} from "lucide-react";
import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import PageHeader from "../components/PageHeader";

export default function Resources() {
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout>
      <div>
        <PageHeader
          eyebrow="Library"
          title="Resources"
          description="Keep track of the material you're using across your BestT learning workspace."
          action={
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d1b3e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#142650] hover:shadow-lg"
            >
              <Upload size={17} />
              Upload material
            </button>
          }
        />

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your resources..."
              className="h-11 w-full rounded-xl bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={20} />
            </div>

            <h2 className="mt-5 font-semibold text-[#0d1b3e]">
              Course documents
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Documents attached to your courses will be organized here.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <BookOpen size={20} />
            </div>

            <h2 className="mt-5 font-semibold text-[#0d1b3e]">
              Learning material
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep your study material organized and ready to explore.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            <FileText size={24} />
          </div>

          <h2 className="mt-5 font-semibold text-[#0d1b3e]">
            Your resource library
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            Upload documents to your courses and they'll appear here as your
            BestT library grows.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
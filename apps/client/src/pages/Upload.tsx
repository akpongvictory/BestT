import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import UploadModal from "../features/documents/components/UploadModal";

export default function Upload() {
  const [openUpload, setOpenUpload] = useState(true);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
            Study materials
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0d1b3e]">
            Upload material
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Add documents to your BestT workspace and use them as
            the foundation for your learning experience.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
              <span className="text-2xl">+</span>
            </div>

            <h2 className="mt-5 text-lg font-semibold text-[#0d1b3e]">
              Add a document
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Upload PDFs, Word documents, or text files to start
              learning from your own material.
            </p>

            <button
              type="button"
              onClick={() => setOpenUpload(true)}
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              Choose document
            </button>
          </div>
        </div>
      </div>

      <UploadModal
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onUpload={() => {
          setOpenUpload(false);
        }}
      />
    </DashboardLayout>
  );
}
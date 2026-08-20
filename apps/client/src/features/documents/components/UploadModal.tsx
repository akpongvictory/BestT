import { useState } from "react";
import {
  FileText,
  Upload,
  X,
  CheckCircle2,
} from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isUploading?: boolean;
}

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.txt";

export default function UploadModal({
  open,
  onClose,
  onUpload,
  isUploading = false,
}: Props) {
  const [file, setFile] = useState<File | null>(null);

  if (!open) {
    return null;
  }

  function handleClose() {
    if (isUploading) {
      return;
    }

    setFile(null);
    onClose();
  }

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  }

  function handleUpload() {
    if (!file || isUploading) {
      return;
    }

    onUpload(file);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Upload size={21} strokeWidth={1.9} />
            </div>

            <h2 className="mt-4 text-xl font-semibold tracking-tight text-[#0d1b3e]">
              Add study material
            </h2>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Upload a document that BestT can use for this course.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            aria-label="Close upload dialog"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <label
            htmlFor="document-upload"
            className={[
              "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition",
              file
                ? "border-blue-200 bg-blue-50/50"
                : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40",
              isUploading
                ? "pointer-events-none opacity-60"
                : "",
            ].join(" ")}
          >
            <input
              id="document-upload"
              type="file"
              accept={ACCEPTED_TYPES}
              onChange={handleFileChange}
              disabled={isUploading}
              className="sr-only"
            />

            {file ? (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <CheckCircle2 size={23} />
                </div>

                <p className="mt-4 max-w-full truncate text-sm font-semibold text-slate-800">
                  {file.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                <span className="mt-3 text-xs font-semibold text-blue-600">
                  Choose a different file
                </span>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-slate-500 shadow-sm">
                  <FileText size={23} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800">
                  Choose a document
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  PDF, DOC, DOCX or TXT
                </p>

                <span className="mt-3 text-xs font-semibold text-blue-600">
                  Browse files
                </span>
              </>
            )}
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0d1b3e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#172b58] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Upload size={16} />

            {isUploading ? "Uploading..." : "Upload material"}
          </button>
        </div>
      </div>
    </div>
  );
}
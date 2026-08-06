import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}

export default function UploadModal({
  open,
  onClose,
  onUpload,
}: Props) {
  const [file, setFile] = useState<File | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6">
        <h2 className="text-2xl font-bold">
          Upload Document
        </h2>

        <input
          className="mt-6"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) =>
            setFile(e.target.files?.[0] ?? null)
          }
        />

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={!file}
            onClick={() => file && onUpload(file)}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:bg-gray-400"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}
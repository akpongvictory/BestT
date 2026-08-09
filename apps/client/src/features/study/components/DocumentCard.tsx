import { useQueryClient } from "@tanstack/react-query";
import { useDeleteDocument } from "../../documents";

interface DocumentCardProps {
  document: {
    id: string;
    filename: string;
    originalName?: string;
    fileType?: string;
    fileUrl?: string;
    createdAt?: string;
  };
}

export default function DocumentCard({
  document,
}: DocumentCardProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useDeleteDocument();

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${document.filename}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(document.id);

      await queryClient.invalidateQueries({
        queryKey: ["course"],
      });
    } catch (error) {
      console.error("Delete document error:", error);

      alert("Failed to delete document.");
    }
  }

  function handleStudy() {
    if (!document.fileUrl) {
      alert("Document file is unavailable.");
      return;
    }

    const fileUrl = document.fileUrl.startsWith("http")
      ? document.fileUrl
      : `http://localhost:5000${
          document.fileUrl.startsWith("/")
            ? ""
            : "/"
        }${document.fileUrl}`;

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <h3 className="font-semibold text-gray-900">
          📄 {document.filename}
        </h3>

        {document.fileType && (
          <p className="mt-1 text-sm text-gray-500">
            {document.fileType}
          </p>
        )}

        <p className="mt-1 text-sm text-gray-500">
          Uploaded:{" "}
          {document.createdAt
            ? new Date(
                document.createdAt
              ).toLocaleDateString()
            : "Unknown"}
        </p>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={handleStudy}
          disabled={!document.fileUrl}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Study
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleteMutation.isPending
            ? "Deleting..."
            : "Delete"}
        </button>
      </div>
    </div>
  );
}
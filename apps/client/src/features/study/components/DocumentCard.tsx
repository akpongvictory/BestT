import { useQueryClient } from "@tanstack/react-query";
import { useDeleteDocument } from "../../documents";

interface DocumentCardProps {
  document: {
    id: string;
    filename: string;
    originalName?: string;
    fileType?: string;
    fileUrl?: string;
    processingStatus?:
      | "PENDING"
      | "PROCESSING"
      | "COMPLETED"
      | "FAILED";
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
      `Delete "${
        document.originalName ?? document.filename
      }"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(
        document.id
      );

      await queryClient.invalidateQueries({
        queryKey: ["course"],
      });
    } catch (error) {
      console.error(
        "Delete document error:",
        error
      );

      alert("Failed to delete document.");
    }
  }

  function handleStudy() {
    if (!document.fileUrl) {
      alert("Document file is unavailable.");
      return;
    }

    const fileUrl =
      document.fileUrl.startsWith("http")
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

  const displayName =
    document.originalName ??
    document.filename;

  const status = document.processingStatus;

  const isProcessing =
    status === "PENDING" ||
    status === "PROCESSING";

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <h3 className="font-semibold text-gray-900">
          📄 {displayName}
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

        {status && (
          <p className="mt-2 text-xs font-medium">
            {status === "COMPLETED" && (
              <span className="text-green-600">
                Ready for learning
              </span>
            )}

            {status === "PROCESSING" && (
              <span className="text-blue-600">
                Processing document...
              </span>
            )}

            {status === "PENDING" && (
              <span className="text-amber-600">
                Waiting to process...
              </span>
            )}

            {status === "FAILED" && (
              <span className="text-red-600">
                Processing failed
              </span>
            )}
          </p>
        )}
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={handleStudy}
          disabled={
            !document.fileUrl ||
            isProcessing
          }
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing
            ? "Processing..."
            : "Study"}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={
            deleteMutation.isPending
          }
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
import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileText,
  Loader2,
  Trash2,
  AlertCircle,
} from "lucide-react";
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

  const displayName =
    document.originalName ?? document.filename;

  const status = document.processingStatus;

  const isProcessing =
    status === "PENDING" ||
    status === "PROCESSING";

  function getStatus() {
    if (status === "COMPLETED") {
      return {
        label: "Ready for learning",
        icon: CheckCircle2,
        className: "bg-emerald-50 text-emerald-700",
      };
    }

    if (status === "PROCESSING") {
      return {
        label: "Processing document",
        icon: Loader2,
        className: "bg-blue-50 text-blue-700",
      };
    }

    if (status === "PENDING") {
      return {
        label: "Waiting to process",
        icon: Clock3,
        className: "bg-amber-50 text-amber-700",
      };
    }

    if (status === "FAILED") {
      return {
        label: "Processing failed",
        icon: AlertCircle,
        className: "bg-red-50 text-red-700",
      };
    }

    return null;
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${displayName}"?`
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
    }
  }

  function handleStudy() {
    if (!document.fileUrl || isProcessing) {
      return;
    }

 const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const fileUrl = document.fileUrl.startsWith("http")
  ? document.fileUrl
  : `${API_URL}${document.fileUrl.startsWith("/") ? "" : "/"}${document.fileUrl}`;

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const statusInfo = getStatus();
  const StatusIcon = statusInfo?.icon;

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Document information */}
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileText size={21} strokeWidth={1.8} />
          </div>

          <div className="min-w-0">
            <h3
              className="truncate text-sm font-semibold text-slate-900"
              title={displayName}
            >
              {displayName}
            </h3>

            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
              {document.fileType && (
                <span>
                  {document.fileType}
                </span>
              )}

              {document.createdAt && (
                <span>
                  Added{" "}
                  {new Date(
                    document.createdAt
                  ).toLocaleDateString()}
                </span>
              )}
            </div>

            {statusInfo && StatusIcon && (
              <div className="mt-3">
                <span
                  className={[
                    "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    statusInfo.className,
                  ].join(" ")}
                >
                  <StatusIcon
                    size={13}
                    className={
                      status === "PROCESSING"
                        ? "animate-spin"
                        : ""
                    }
                  />

                  {statusInfo.label}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleStudy}
            disabled={
              !document.fileUrl ||
              isProcessing
            }
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
          >
            <ExternalLink size={14} />

            {isProcessing
              ? "Processing"
              : "Open"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            aria-label={`Delete ${displayName}`}
            title="Delete document"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
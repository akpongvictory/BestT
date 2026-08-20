import { toast as sonnerToast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info, X, type LucideIcon } from "lucide-react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface VariantStyle {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  border: string;
}

const variantConfig: { [key in ToastVariant]: VariantStyle } = {
  success: {
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  error: {
    icon: XCircle,
    iconColor: "text-red-600",
    iconBg: "bg-red-50",
    border: "border-red-100",
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-amber-600",
    iconBg: "bg-amber-50",
    border: "border-amber-100",
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-50",
    border: "border-blue-100",
  },
};

function renderToast(
  id: string | number,
  variant: ToastVariant,
  title: string,
  description?: string
) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={`flex w-full max-w-sm items-start gap-3 rounded-2xl border ${config.border} bg-white p-4 shadow-lg shadow-slate-900/10`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.iconBg} ${config.iconColor}`}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        {description && (
          <p className="mt-0.5 text-sm leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => sonnerToast.dismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
      >
        <X size={15} />
      </button>
    </div>
  );
}

export const notify = {
  success: (title: string, description?: string) =>
    sonnerToast.custom((id) => renderToast(id, "success", title, description)),
  error: (title: string, description?: string) =>
    sonnerToast.custom((id) => renderToast(id, "error", title, description)),
  warning: (title: string, description?: string) =>
    sonnerToast.custom((id) => renderToast(id, "warning", title, description)),
  info: (title: string, description?: string) =>
    sonnerToast.custom((id) => renderToast(id, "info", title, description)),
};
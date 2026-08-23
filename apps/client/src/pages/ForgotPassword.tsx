import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { forgotPassword } from "../services/auth";
import AuthLayout from "../layouts/AuthLayout";

interface ForgotPasswordForm {
  email: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

function getErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null) {
    const apiError = error as ApiError;

    return (
      apiError.response?.data?.message ??
      apiError.message ??
      "Unable to send the password reset email. Please try again."
    );
  }

  return "Unable to send the password reset email. Please try again.";
}

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    mode: "onBlur",
  });

  async function onSubmit(data: ForgotPasswordForm) {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSuccessMessage("");
      setErrorMessage("");

      const response = await forgotPassword({
        email: data.email.trim(),
      });

      setSuccessMessage(
        response.message ??
          "If an account exists with this email, a password reset link has been sent."
      );
    } catch (error: unknown) {
      console.error("Forgot password failed:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email address and we'll send you a link to reset your password."
      alternateText="Remember your password?"
      alternateLabel="Sign in"
      alternateHref="/login"
    >
      <div className="space-y-5">
        {/* Success */}
        {successMessage && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3"
          >
            <CheckCircle2
              size={18}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-emerald-600"
            />

            <div>
              <p className="text-sm font-semibold text-emerald-900">
                Check your email
              </p>

              <p className="mt-0.5 text-sm leading-5 text-emerald-800">
                {successMessage}
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <AlertCircle
              size={18}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <div>
              <p className="text-sm font-semibold text-red-900">
                Something went wrong
              </p>

              <p className="mt-0.5 text-sm leading-5 text-red-800">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={18}
                strokeWidth={1.9}
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                placeholder="you@example.com"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={
                  errors.email ? "email-error" : undefined
                }
                disabled={isSubmitting}
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
                  errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                }`}
                {...register("email", {
                  required: "Email address is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
              />
            </div>

            {errors.email && (
              <p
                id="email-error"
                className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"
              >
                <AlertCircle size={13} strokeWidth={2} />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0d1b3e] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#172b58] hover:shadow-lg hover:shadow-[#0d1b3e]/15 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2
                  size={18}
                  strokeWidth={2}
                  className="animate-spin"
                />
                Sending reset link...
              </>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium text-slate-400">
            Secure password recovery
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

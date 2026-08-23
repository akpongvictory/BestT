import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { resetPassword } from "../services/auth";
import AuthLayout from "../layouts/AuthLayout";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
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
      "Unable to reset your password. Please try again."
    );
  }

  return "Unable to reset your password. Please try again.";
}

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    mode: "onBlur",
  });

  const password = watch("password");

  async function onSubmit(data: ResetPasswordForm) {
    if (isSubmitting) {
      return;
    }

    if (!token) {
      setErrorMessage(
        "This password reset link is invalid or missing."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setSuccessMessage("");
      setErrorMessage("");

      const response = await resetPassword({
        token,
        password: data.password,
      });

      setSuccessMessage(
        response.message ??
          "Password reset successfully. You can now sign in."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            passwordReset: true,
          },
        });
      }, 1500);
    } catch (error: unknown) {
      console.error("Reset password failed:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create a new password"
      subtitle="Choose a strong new password for your BestT account."
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
                Password updated
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
                Unable to reset password
              </p>

              <p className="mt-0.5 text-sm leading-5 text-red-800">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        {/* Missing token */}
        {!token && !errorMessage && (
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
                Invalid reset link
              </p>

              <p className="mt-0.5 text-sm leading-5 text-red-800">
                This password reset link is missing or invalid.
                Please request a new one.
              </p>
            </div>
          </div>
        )}

        {token && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* New password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  strokeWidth={1.9}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Enter your new password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password
                      ? "password-error"
                      : undefined
                  }
                  disabled={isSubmitting}
                  className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
                    errors.password
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  }`}
                  {...register("password", {
                    required: "New password is required.",
                    minLength: {
                      value: 8,
                      message:
                        "Password must be at least 8 characters long.",
                    },
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  disabled={isSubmitting}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.9} />
                  ) : (
                    <Eye size={18} strokeWidth={1.9} />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"
                >
                  <AlertCircle size={13} strokeWidth={2} />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Confirm new password
              </label>

              <div className="relative">
                <Lock
                  size={18}
                  strokeWidth={1.9}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword ? "text" : "password"
                  }
                  autoComplete="new-password"
                  placeholder="Confirm your new password"
                  aria-invalid={
                    errors.confirmPassword ? "true" : "false"
                  }
                  aria-describedby={
                    errors.confirmPassword
                      ? "confirm-password-error"
                      : undefined
                  }
                  disabled={isSubmitting}
                  className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-50"
                      : "border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  }`}
                  {...register("confirmPassword", {
                    required: "Please confirm your new password.",
                    validate: (value) =>
                      value === password ||
                      "Passwords do not match.",
                  })}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  disabled={isSubmitting}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmed password"
                      : "Show confirmed password"
                  }
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} strokeWidth={1.9} />
                  ) : (
                    <Eye size={18} strokeWidth={1.9} />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p
                  id="confirm-password-error"
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"
                >
                  <AlertCircle size={13} strokeWidth={2} />
                  {errors.confirmPassword.message}
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
                  Updating password...
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
        )}

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium text-slate-400">
            Secure password recovery
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-sm text-slate-500">
          Need a new reset link?{" "}
          <Link
            to="/forgot-password"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Request one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

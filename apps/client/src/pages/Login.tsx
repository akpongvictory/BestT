import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { loginUser } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../layouts/AuthLayout";

interface LoginForm {
  email: string;
  password: string;
}

interface LocationState {
  registered?: boolean;
  passwordReset?: boolean;
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
      "Unable to sign you in. Please check your details and try again."
    );
  }

  return "Unable to sign you in. Please check your details and try again.";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onBlur",
  });

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(data: LoginForm) {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await loginUser({
        email: data.email.trim(),
        password: data.password,
      });

      login(response.token, response.data);

      navigate("/dashboard", { replace: true });
    } catch (error: unknown) {
      console.error("Login failed:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  const locationState =
    location.state as LocationState | null;

  const registeredSuccessfully =
    locationState?.registered === true;

  const passwordResetSuccessfully =
    locationState?.passwordReset === true;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning journey with BestT."
      alternateText="Don't have an account?"
      alternateLabel="Create one"
      alternateHref="/register"
    >
      <div className="space-y-5">
        {/* Password reset success */}
        {passwordResetSuccessfully && (
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
                Password reset successful
              </p>

              <p className="mt-0.5 text-sm leading-5 text-emerald-800">
                Your password has been updated. You can now sign
                in.
              </p>
            </div>
          </div>
        )}

        {/* Registration success */}
        {registeredSuccessfully && (
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
                Account created
              </p>

              <p className="mt-0.5 text-sm leading-5 text-emerald-800">
                Your account has been created. Sign in to get
                started.
              </p>
            </div>
          </div>
        )}

        {/* Login error */}
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
                Sign in unsuccessful
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

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
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
                autoComplete="current-password"
                placeholder="Enter your password"
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
                  required: "Password is required.",
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
                aria-pressed={showPassword}
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

            <div className="mt-2 flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
              >
                Forgot your password?
              </Link>
            </div>
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
                Signing you in...
              </>
            ) : (
              "Sign in to BestT"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-xs font-medium text-slate-400">
            Secure sign in
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-xs leading-5 text-slate-400">
          BestT is designed to help you learn, research, and work
          with your study material more effectively.
        </p>

        <p className="text-center text-sm text-slate-500">
          New to BestT?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Create your account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
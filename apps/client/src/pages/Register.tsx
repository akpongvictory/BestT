import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import { registerUser } from "../services/auth";
import { getApiErrorMessage } from "../utils/apiError";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../layouts/AuthLayout";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(data: RegisterForm) {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await registerUser(data);

      navigate("/login", {
        replace: true,
        state: {
          registered: true,
        },
      });
    } catch (error: unknown) {
      console.error("REGISTER ERROR:", error);

    setErrorMessage(
  getApiErrorMessage(
    error,
    "Unable to create your account. Please check your details and try again."
  )
);

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your BestT account"
      subtitle="Build your personal learning workspace and start exploring your material."
      alternateText="Already have an account?"
      alternateLabel="Sign in"
      alternateHref="/login"
    >
      <div className="space-y-5">
        {errorMessage && (
          <div
            role="alert"
            aria-live="polite"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
          >
            <AlertCircle
              size={18}
              className="mt-0.5 shrink-0 text-red-600"
            />

            <p className="text-sm leading-5 text-red-800">
              {errorMessage}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Your name
            </label>

            <div className="relative">
              <User
                size={18}
                strokeWidth={1.9}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                aria-invalid={Boolean(errors.name)}
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                  errors.name
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-50"
                }`}
                {...register("name", {
                  required: "Your name is required.",
                  minLength: {
                    value: 2,
                    message: "Your name is too short.",
                  },
                })}
              />
            </div>

            {errors.name && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle size={13} />
                {errors.name.message}
              </p>
            )}
          </div>

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
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                  errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-50"
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
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle size={13} />
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
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a secure password"
                aria-invalid={Boolean(errors.password)}
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                  errors.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-slate-200 focus:border-blue-500 focus:ring-blue-50"
                }`}
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 6 characters.",
                  },
                })}
              />

              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors duration-200 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.9} />
                ) : (
                  <Eye size={18} strokeWidth={1.9} />
                )}
              </button>
            </div>

            {errors.password ? (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle size={13} />
                {errors.password.message}
              </p>
            ) : (
              <p className="mt-2 text-xs text-slate-400">
                Use at least 8 characters.
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0d1b3e] px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#172b58] hover:shadow-lg hover:shadow-[#0d1b3e]/15 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-[#0d1b3e]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating your workspace...
              </>
            ) : (
              <>
                Create my BestT account
                <CheckCircle2
                  size={17}
                  className="transition-transform duration-200 group-hover:scale-105"
                />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 pt-1">
          <div className="h-px flex-1 bg-slate-200" />

          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Secure workspace
          </span>

          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-xs leading-5 text-slate-400">
          Your account gives you a personal space for courses, study
          material, conversations and learning progress.
        </p>
      </div>
    </AuthLayout>
  );
}






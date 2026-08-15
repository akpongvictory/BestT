import { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";

import { registerUser } from "../services/auth";
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
    } catch (error: any) {
      console.error("REGISTER ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ??
          error.message ??
          "Unable to create your account. Please try again."
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
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Victory"
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                  errors.name
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
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
              <p className="mt-2 text-xs text-red-600">
                {errors.name.message}
              </p>
            )}
          </div>

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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                  errors.email
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
                {...register("email", {
                  required: "Email address is required.",
                })}
              />
            </div>

            {errors.email && (
              <p className="mt-2 text-xs text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

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
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a secure password"
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                  errors.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
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
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.password && (
              <p className="mt-2 text-xs text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating your workspace...
              </>
            ) : (
              "Create my BestT account"
            )}
          </button>
        </form>

        <p className="text-center text-xs leading-5 text-slate-400">
          Your account gives you a personal space for courses, study
          material, conversations and learning progress.
        </p>
      </div>
    </AuthLayout>
  );
}
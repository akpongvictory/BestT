import { useState } from "react";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

import { loginUser } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../layouts/AuthLayout";

interface LoginForm {
  email: string;
  password: string;
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
  } = useForm<LoginForm>();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  async function onSubmit(data: LoginForm) {
    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await loginUser(data);

      login(response.token, response.data);

      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      setErrorMessage(
        error.response?.data?.message ??
          error.message ??
          "Unable to sign you in. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const registeredSuccessfully =
    (location.state as { registered?: boolean } | null)?.registered;

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your learning journey with BestT."
      alternateText="Don't have an account?"
      alternateLabel="Create one"
      alternateHref="/register"
    >
      <div className="space-y-5">
        {registeredSuccessfully && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Your account has been created. Sign in to get started.
          </div>
        )}

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
            <div className="mb-2 flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <button
                type="button"
                className="text-xs font-medium text-slate-500 hover:text-indigo-600"
              >
                Forgot password?
              </button>
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 ${
                  errors.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-50"
                }`}
                {...register("password", {
                  required: "Password is required.",
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
                Signing you in...
              </>
            ) : (
              "Sign in to BestT"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs text-slate-400">or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="text-center text-xs leading-5 text-slate-400">
          By continuing, you agree to use BestT responsibly as a learning
          and research companion.
        </p>
      </div>
    </AuthLayout>
  );
}
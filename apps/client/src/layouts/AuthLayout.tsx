import { ReactNode } from "react";
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  alternateText: string;
  alternateLabel: string;
  alternateHref: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
  alternateText,
  alternateLabel,
  alternateHref,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-slate-950 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(79,70,229,0.28),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(14,165,233,0.18),transparent_35%)]" />

          <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              to="/"
              className="group flex w-fit items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-950 shadow-lg transition-transform duration-200 group-hover:scale-105">
                <BookOpen size={20} strokeWidth={2.2} />
              </div>

              <span className="text-xl font-bold tracking-tight text-white">
                BestT
              </span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 flex items-center gap-2 text-indigo-300">
                <Sparkles size={17} />
                <span className="text-sm font-semibold tracking-wide">
                  YOUR PERSONAL LEARNING COMPANION
                </span>
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl">
                Turn what you study into something you actually understand.
              </h2>

              <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300">
                Bring your course material, research, notes and learning
                sources together. BestT helps you explore them through
                conversation.
              </p>
            </div>

            <p className="text-sm text-slate-500">
              Study smarter. Understand deeper.
            </p>
          </div>
        </section>

        {/* Form panel */}
        <section className="flex min-h-screen items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft size={16} />
              Back to BestT
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm lg:hidden">
                <BookOpen size={21} />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-slate-950">
                {title}
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            </div>

            {children}

            <p className="mt-8 text-center text-sm text-slate-500">
              {alternateText}{" "}
              <Link
                to={alternateHref}
                className="font-semibold text-slate-900 transition-colors hover:text-indigo-600"
              >
                {alternateLabel}
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
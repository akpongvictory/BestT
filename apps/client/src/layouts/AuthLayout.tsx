import { ReactNode } from "react";
import { ArrowLeft, BookOpen } from "lucide-react";
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
        <section className="relative hidden overflow-hidden bg-[#0d1b3e] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(59,130,246,0.24),transparent_34%),radial-gradient(circle_at_82%_82%,rgba(99,102,241,0.18),transparent_36%)]" />

          <div className="absolute -right-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full border border-white/[0.06]" />
          <div className="absolute -right-20 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full border border-white/[0.06]" />

          <div className="absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:48px_48px]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            {/* Brand */}
            <Link
              to="/"
              aria-label="BestT home"
              className="group inline-flex w-fit items-center"
            >
              <img
                src="/bestt-logo.png"
                alt="BestT"
                className="h-12 w-auto object-contain brightness-0 invert transition-transform duration-200 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Brand message */}
            <div className="max-w-xl">
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-3.5 py-2 text-indigo-100 backdrop-blur-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-500/15 text-blue-300">
                  <BookOpen size={14} strokeWidth={1.9} />
                </span>

                <span className="text-[11px] font-semibold tracking-[0.14em]">
                  YOUR PERSONAL LEARNING COMPANION
                </span>
              </div>

              <h2 className="max-w-2xl text-4xl font-bold leading-[1.08] tracking-[-0.035em] text-white xl:text-5xl">
                Turn what you study into something you actually
                <span className="text-blue-300"> understand.</span>
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-300 xl:text-lg xl:leading-8">
                Bring your course material, research, notes and
                learning sources together. BestT helps you explore
                them through conversation.
              </p>

              <div className="mt-8 flex items-center gap-3 text-sm text-slate-400">
                <span className="h-px w-8 bg-blue-400/60" />
                Study smarter. Understand deeper.
              </div>
            </div>

            <p className="text-xs font-medium tracking-wide text-slate-500">
              A focused workspace for learning and research.
            </p>
          </div>
        </section>

        {/* Form panel */}
        <section className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-10 lg:bg-[#f7f8fc]">
          <div className="w-full max-w-md">
            {/* Back link */}
            <Link
              to="/"
              className="group mb-9 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors duration-200 hover:text-slate-900"
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to BestT
            </Link>

            {/* Mobile brand */}
            <div className="mb-9 lg:hidden">
              <Link
                to="/"
                aria-label="BestT home"
                className="inline-flex"
              >
                <img
                  src="/bestt-logo.png"
                  alt="BestT"
                  className="h-10 w-auto object-contain"
                />
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-[-0.025em] text-slate-950 sm:text-[34px]">
                {title}
              </h1>

              <p className="mt-2.5 max-w-sm text-sm leading-6 text-slate-500">
                {subtitle}
              </p>
            </div>

            {/* Form content */}
            <div>{children}</div>

            {/* Alternate auth action */}
            <p className="mt-8 text-center text-sm text-slate-500">
              {alternateText}{" "}
              <Link
                to={alternateHref}
                className="font-semibold text-slate-900 transition-colors duration-200 hover:text-blue-600"
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
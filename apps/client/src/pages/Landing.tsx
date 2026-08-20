import {
  ArrowRight,
  BookOpen,
  FileText,
  Globe,
  Play,
  Search,
  Brain,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

const sources = [
  {
    icon: FileText,
    title: "PDFs",
    description: "Bring your course materials and documents.",
  },
  {
    icon: Globe,
    title: "Web pages",
    description: "Learn from articles and online resources.",
  },
  {
    icon: BookOpen,
    title: "Notes",
    description: "Paste your own notes and study material.",
  },
  {
    icon: Play,
    title: "YouTube links",
    description: "Turn educational videos into study material.",
  },
];

const capabilities = [
  {
    icon: Brain,
    title: "Understand",
    description:
      "Ask BestT to explain difficult concepts in a way that makes sense to you.",
  },
  {
    icon: Search,
    title: "Explore",
    description:
      "Investigate your material interactively instead of searching through it alone.",
  },
  {
    icon: MessageCircle,
    title: "Learn actively",
    description:
      "Turn your resources into an interactive learning experience.",
  },
];

const audiences = [
  {
    title: "Students",
    text: "Understand lectures, revise material and prepare with confidence.",
  },
  {
    title: "Researchers",
    text: "Explore references and interact with information more efficiently.",
  },
  {
    title: "Independent learners",
    text: "Turn scattered resources into a focused learning experience.",
  },
];

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafbfc] text-slate-900">
      <style>
        {`
          @keyframes bestt-hero-image {
            0% {
              transform: scale(1.02);
            }
            100% {
              transform: scale(1.07);
            }
          }

          @keyframes bestt-fade-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bestt-fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes bestt-soft-float {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes bestt-scroll-reveal {
            from {
              opacity: 0;
              transform: translateY(22px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .bestt-hero-image {
            animation: bestt-hero-image 18s ease-out forwards;
            transform-origin: center center;
          }

          .bestt-fade-up {
            animation: bestt-fade-up 0.75s cubic-bezier(0.22, 1, 0.36, 1)
              both;
          }

          .bestt-fade-in {
            animation: bestt-fade-in 1s ease-out both;
          }

          .bestt-soft-float {
            animation: bestt-soft-float 5s ease-in-out infinite;
          }

          .bestt-scroll-reveal {
            animation: bestt-scroll-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1)
              both;
          }

          .bestt-delay-1 {
            animation-delay: 100ms;
          }

          .bestt-delay-2 {
            animation-delay: 180ms;
          }

          .bestt-delay-3 {
            animation-delay: 260ms;
          }

          .bestt-delay-4 {
            animation-delay: 340ms;
          }

          @media (prefers-reduced-motion: reduce) {
            .bestt-hero-image,
            .bestt-fade-up,
            .bestt-fade-in,
            .bestt-soft-float,
            .bestt-scroll-reveal {
              animation: none;
            }

            html {
              scroll-behavior: auto;
            }
          }
        `}
      </style>

      {/* Navigation */}
      <header className="relative z-30 border-b border-white/70 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            to="/"
            aria-label="BestT home"
            className="group flex items-center"
          >
            <img
              src="/bestt-logo.png"
              alt="BestT"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-950"
            >
              How it works
            </a>

            <a
              href="#built-for"
              className="text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-950"
            >
              Built for
            </a>

            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-blue-600"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-[#0d1b3e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#172b58] hover:shadow-md"
            >
              Get started
            </Link>
          </nav>

          <Link
            to="/login"
            className="rounded-lg px-2 py-1 text-sm font-semibold text-slate-700 transition-colors hover:text-blue-600 md:hidden"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate min-h-[680px] overflow-hidden">
        {/* Hero photograph */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <img
            src="/bestt-study-group.jpg"
            alt=""
            aria-hidden="true"
            className="bestt-hero-image h-full w-full object-cover object-[center_45%]"
          />
        </div>

        {/* Readability treatment */}
        <div className="absolute inset-0 -z-10 bg-slate-950/30" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/55 via-slate-950/25 to-slate-950/10" />

        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-slate-950/25 to-transparent" />

        {/* Subtle atmospheric accents */}
        <div className="absolute -left-32 top-24 -z-10 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="absolute -right-20 bottom-10 -z-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-24 text-center lg:px-8 lg:pb-28 lg:pt-32">
          {/* Hero badge */}
          <div className="bestt-fade-up inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md">
            <BookOpen size={15} strokeWidth={2} />
            Your intelligent study companion
          </div>

          {/* Hero heading */}
          <h1 className="bestt-fade-up bestt-delay-1 mt-7 max-w-4xl text-5xl font-bold tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Your material.
            <br />
            <span className="text-blue-300">Your questions.</span>
          </h1>

          {/* Hero description */}
          <p className="bestt-fade-up bestt-delay-2 mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Bring your PDFs, webpages, notes and learning resources
            into one intelligent workspace. Ask questions, understand
            difficult ideas and study at your own pace.
          </p>

          {/* Hero actions */}
          <div className="bestt-fade-up bestt-delay-3 mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-950/25 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-950/30 active:translate-y-0 sm:w-auto"
            >
              Start learning

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/15 active:translate-y-0 sm:w-auto"
            >
              Sign in
            </Link>
          </div>

          {/* Supporting text */}
          <p className="bestt-fade-up bestt-delay-4 mt-6 text-xs font-medium tracking-wide text-slate-300">
            Built for students, researchers and curious minds.
          </p>

          {/* Scroll cue */}
          <div className="bestt-fade-in mt-14 hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm sm:flex">
            <ArrowRight
              size={16}
              className="rotate-90"
              strokeWidth={1.8}
            />
          </div>
        </div>
      </section>

      {/* Source cards */}
      <section
        id="how-it-works"
        className="border-y border-slate-200/80 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="bestt-scroll-reveal mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Bring your material
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with what you already have.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              BestT is designed around your learning material, not
              around a particular format.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sources.map((source, index) => {
              const Icon = source.icon;

              return (
                <div
                  key={source.title}
                  className="bestt-scroll-reveal group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50"
                  style={{
                    animationDelay: `${index * 80}ms`,
                  }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-600/20">
                    <Icon
                      size={21}
                      strokeWidth={1.9}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-5 font-semibold text-slate-900">
                    {source.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {source.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-[#fafbfc]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="bestt-scroll-reveal">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Learn differently
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                More than finding an answer.
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-slate-600">
                BestT is designed to help you work with information
                interactively. Ask, explore, clarify and revise, all
                around the material you are actually studying.
              </p>

              <Link
                to="/register"
                className="group mt-7 inline-flex items-center gap-2 font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700"
              >
                Create your workspace

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="space-y-4">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;

                return (
                  <div
                    key={capability.title}
                    className="bestt-scroll-reveal group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white transition-all duration-300 group-hover:bg-blue-600">
                      <Icon
                        size={20}
                        strokeWidth={1.9}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-slate-400">
                          0{index + 1}
                        </span>

                        <h3 className="font-semibold text-slate-900">
                          {capability.title}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {capability.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Built for */}
      <section
        id="built-for"
        className="bg-slate-950 text-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="bestt-scroll-reveal mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Built for learning
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              One workspace. Different ways to learn.
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              Whether you are preparing for an exam, researching a
              subject or simply trying to understand something better,
              BestT adapts to the way you learn.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {audiences.map((audience, index) => (
              <div
                key={audience.title}
                className="bestt-scroll-reveal group rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                style={{
                  animationDelay: `${index * 90}ms`,
                }}
              >
                <div className="mb-5 h-px w-8 bg-blue-500 transition-all duration-300 group-hover:w-12" />

                <h3 className="font-semibold">
                  {audience.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {audience.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
          <div className="bestt-soft-float mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <BookOpen size={22} strokeWidth={1.9} />
          </div>

          <h2 className="bestt-scroll-reveal mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Ready to study with BestT?
          </h2>

          <p className="bestt-scroll-reveal mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Create your workspace and start turning your learning
            material into an interactive study experience.
          </p>

          <Link
            to="/register"
            className="bestt-scroll-reveal group mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
          >
            Get started

            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link
            to="/"
            aria-label="BestT home"
            className="inline-flex items-center"
          >
            <img
              src="/bestt-logo.png"
              alt="BestT"
              className="h-9 w-auto object-contain transition-transform duration-300 hover:scale-[1.02]"
            />
          </Link>

          <p className="text-sm text-slate-500">
            Learn. Understand. Explore.
          </p>

          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} BestT
          </p>
        </div>
      </footer>
    </main>
  );
}
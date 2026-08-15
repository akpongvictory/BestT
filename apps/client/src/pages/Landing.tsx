import {
  ArrowRight,
  BookOpen,
  FileText,
  Globe,
  Play,
  Sparkles,
  Search,
  Brain,
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
    icon: Sparkles,
    title: "Learn actively",
    description:
      "Turn your resources into an interactive learning experience.",
  },
];

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafbfc] text-slate-900">
      {/* Navigation */}
      <header className="relative z-10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
              <Sparkles size={18} strokeWidth={2.2} />
            </div>

            <span className="text-xl font-bold tracking-tight">
              BestT
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              How it works
            </a>

            <a
              href="#built-for"
              className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              Built for
            </a>

            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-600"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Get started
            </Link>
          </nav>

          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 md:hidden"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-violet-100/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-24 pt-20 text-center lg:px-8 lg:pt-28">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
            <Sparkles size={15} />
            Your intelligent study companion
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">
            Your material.
            <br />
            <span className="text-blue-600">
              Your questions.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
            Bring your PDFs, webpages, notes and learning
            resources into one intelligent workspace. Ask questions,
            understand difficult ideas and study at your own pace.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/register"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 sm:w-auto"
            >
              Start learning
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>

            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-5 text-xs font-medium text-slate-400">
            Built for students, researchers and curious minds.
          </p>
        </div>
      </section>

      {/* Source cards */}
      <section
        id="how-it-works"
        className="border-y border-slate-200/80 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
              Bring your material
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Start with what you already have.
            </h2>

            <p className="mt-4 leading-7 text-slate-600">
              BestT is designed around your learning material—not
              around a particular format.
            </p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sources.map((source) => {
              const Icon = source.icon;

              return (
                <div
                  key={source.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <Icon size={21} />
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
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
                Learn differently
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                More than finding an answer.
              </h2>

              <p className="mt-5 max-w-lg leading-7 text-slate-600">
                BestT is designed to help you work with information
                interactively. Ask, explore, clarify and revise—all
                around the material you are actually studying.
              </p>

              <Link
                to="/register"
                className="mt-7 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Create your workspace
                <ArrowRight size={17} />
              </Link>
            </div>

            <div className="space-y-4">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;

                return (
                  <div
                    key={capability.title}
                    className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <Icon size={20} />
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
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
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
            {[
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
            ].map((audience) => (
              <div
                key={audience.title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
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
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <Sparkles size={22} />
          </div>

          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Ready to study with BestT?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
            Create your workspace and start turning your learning
            material into an interactive study experience.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Get started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div className="font-semibold text-slate-900">
            BestT
          </div>

          <p>
            Learn. Understand. Explore.
          </p>

          <p>
            © {new Date().getFullYear()} BestT
          </p>
        </div>
      </footer>
    </main>
  );
}
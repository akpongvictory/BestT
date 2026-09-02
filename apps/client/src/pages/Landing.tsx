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
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";

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

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type RevealDirection = "up" | "left" | "right" | "scale";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: RevealDirection;
  threshold?: number;
}

/* -------------------------------------------------------------------------- */
/* CSS variable helper                                                        */
/* -------------------------------------------------------------------------- */

const motionStyle = (delay: number): CSSProperties =>
  ({
    "--bestt-delay": `${delay}ms`,
  }) as CSSProperties;

/* -------------------------------------------------------------------------- */
/* Intersection Observer reveal hook                                          */
/* -------------------------------------------------------------------------- */

function useReveal({
  threshold = 0.12,
  rootMargin = "0px 0px -50px 0px",
}: {
  threshold?: number;
  rootMargin?: string;
} = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    // Respect reduced-motion users.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin]);

  return [ref, visible] as const;
}

/* -------------------------------------------------------------------------- */
/* Reusable reveal component                                                  */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  threshold = 0.12,
}: RevealProps) {
  const [ref, visible] = useReveal({ threshold });

  return (
    <div
      ref={ref}
      className={[
        "bestt-reveal",
        `bestt-reveal-${direction}`,
        visible ? "bestt-reveal-visible" : "",
        className,
      ].join(" ")}
      style={motionStyle(delay)}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafbfc] text-slate-900">
      <style>
        {`
          /* ================================================================== */
          /* BESTT MOTION SYSTEM                                                 */
          /* ================================================================== */

          @keyframes bestt-hero-zoom {
            0% {
              transform: scale(1.025);
            }

            100% {
              transform: scale(1.09);
            }
          }

          @keyframes bestt-hero-glow {
            0%,
            100% {
              opacity: 0.45;
              transform: scale(1) translate3d(0, 0, 0);
            }

            50% {
              opacity: 0.7;
              transform: scale(1.08) translate3d(12px, -10px, 0);
            }
          }

          @keyframes bestt-hero-glow-right {
            0%,
            100% {
              opacity: 0.25;
              transform: translate3d(0, 0, 0) scale(1);
            }

            50% {
              opacity: 0.5;
              transform: translate3d(-15px, -12px, 0) scale(1.06);
            }
          }

          @keyframes bestt-badge-pulse {
            0%,
            100% {
              box-shadow:
                0 10px 35px rgba(15, 23, 42, 0.08),
                inset 0 0 0 rgba(255, 255, 255, 0);
            }

            50% {
              box-shadow:
                0 14px 45px rgba(15, 23, 42, 0.12),
                inset 0 0 18px rgba(255, 255, 255, 0.06);
            }
          }

          @keyframes bestt-scroll-cue {
            0%,
            100% {
              transform: translateY(0);
              opacity: 0.55;
            }

            50% {
              transform: translateY(5px);
              opacity: 1;
            }
          }

          @keyframes bestt-shimmer {
            0% {
              background-position: 200% center;
            }

            100% {
              background-position: -200% center;
            }
          }

          @keyframes bestt-ambient-pulse {
            0%,
            100% {
              transform: scale(0.96);
              opacity: 0.25;
            }

            50% {
              transform: scale(1.08);
              opacity: 0.42;
            }
          }

          @keyframes bestt-icon-float {
            0%,
            100% {
              transform: translateY(0);
            }

            50% {
              transform: translateY(-2px);
            }
          }

          /* ================================================================== */
          /* HERO                                                                */
          /* ================================================================== */

          .bestt-hero-image {
            animation:
              bestt-hero-zoom
              20s
              cubic-bezier(0.16, 1, 0.3, 1)
              forwards;

            transform-origin: center center;
            will-change: transform;
          }

          .bestt-hero-glow-left {
            animation:
              bestt-hero-glow
              9s
              ease-in-out
              infinite;

            will-change: transform, opacity;
          }

          .bestt-hero-glow-right {
            animation:
              bestt-hero-glow-right
              11s
              ease-in-out
              infinite;

            will-change: transform, opacity;
          }

          .bestt-hero-badge {
            animation:
              bestt-badge-pulse
              5s
              ease-in-out
              infinite;
          }

          .bestt-hero-question {
            background:
              linear-gradient(
                100deg,
                #93c5fd 0%,
                #bfdbfe 35%,
                #ffffff 50%,
                #bfdbfe 65%,
                #93c5fd 100%
              );

            background-size: 220% auto;
            background-clip: text;
            -webkit-background-clip: text;
            color: transparent;

            animation:
              bestt-shimmer
              7s
              linear
              infinite;
          }

          .bestt-scroll-cue {
            animation:
              bestt-scroll-cue
              2.4s
              ease-in-out
              infinite;
          }

          /* ================================================================== */
          /* SCROLL REVEALS                                                      */
          /* ================================================================== */

          .bestt-reveal {
            opacity: 0;
            filter: blur(7px);

            transition:
              opacity 900ms cubic-bezier(0.22, 1, 0.36, 1),
              transform 900ms cubic-bezier(0.22, 1, 0.36, 1),
              filter 900ms cubic-bezier(0.22, 1, 0.36, 1);

            transition-delay: var(--bestt-delay, 0ms);

            will-change:
              opacity,
              transform,
              filter;
          }

          .bestt-reveal-up {
            transform: translate3d(0, 34px, 0);
          }

          .bestt-reveal-left {
            transform: translate3d(-38px, 0, 0);
          }

          .bestt-reveal-right {
            transform: translate3d(38px, 0, 0);
          }

          .bestt-reveal-scale {
            transform: translate3d(0, 20px, 0) scale(0.96);
          }

          .bestt-reveal-visible {
            opacity: 1;
            filter: blur(0);
            transform: translate3d(0, 0, 0) scale(1);
          }

          /* ================================================================== */
          /* SOURCE CARDS                                                        */
          /* ================================================================== */

          .bestt-source-card {
            position: relative;
            overflow: hidden;
            transform: translateZ(0);
          }

          .bestt-source-card::before {
            content: "";

            position: absolute;
            inset: 0;

            pointer-events: none;

            background:
              radial-gradient(
                circle at 15% 10%,
                rgba(59, 130, 246, 0.12),
                transparent 35%
              );

            opacity: 0;

            transition:
              opacity 450ms ease;
          }

          .bestt-source-card:hover::before {
            opacity: 1;
          }

          .bestt-source-icon {
            transition:
              transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
              background-color 300ms ease,
              color 300ms ease,
              box-shadow 300ms ease;
          }

          .bestt-source-card:hover .bestt-source-icon {
            transform:
              translateY(-3px)
              rotate(-3deg)
              scale(1.06);
          }

          .bestt-source-arrow {
            opacity: 0;

            transform:
              translate3d(-5px, 3px, 0);

            transition:
              opacity 300ms ease,
              transform 400ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .bestt-source-card:hover .bestt-source-arrow {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }

          /* ================================================================== */
          /* CAPABILITY CARDS                                                    */
          /* ================================================================== */

          .bestt-capability-card {
            position: relative;
            overflow: hidden;
          }

          .bestt-capability-card::after {
            content: "";

            position: absolute;

            left: 0;
            top: 0;
            bottom: 0;

            width: 2px;

            background:
              linear-gradient(
                to bottom,
                #2563eb,
                #60a5fa,
                transparent
              );

            transform: scaleY(0);
            transform-origin: top;

            transition:
              transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .bestt-capability-card:hover::after {
            transform: scaleY(1);
          }

          .bestt-capability-icon {
            transition:
              transform 450ms cubic-bezier(0.22, 1, 0.36, 1),
              background-color 300ms ease;
          }

          .bestt-capability-card:hover .bestt-capability-icon {
            transform:
              translateY(-2px)
              scale(1.05);
          }

          /* ================================================================== */
          /* AUDIENCE CARDS                                                      */
          /* ================================================================== */

          .bestt-audience-card {
            position: relative;
            overflow: hidden;
          }

          .bestt-audience-card::before {
            content: "";

            position: absolute;
            inset: -100%;

            background:
              radial-gradient(
                circle,
                rgba(59, 130, 246, 0.1),
                transparent 35%
              );

            opacity: 0;

            transition:
              opacity 500ms ease;
          }

          .bestt-audience-card:hover::before {
            opacity: 1;
          }

          .bestt-audience-line {
            transition:
              width 500ms cubic-bezier(0.22, 1, 0.36, 1),
              background-color 300ms ease;
          }

          .bestt-audience-card:hover .bestt-audience-line {
            width: 48px;
            background-color: #60a5fa;
          }

          /* ================================================================== */
          /* CTA                                                                 */
          /* ================================================================== */

          .bestt-cta-orb {
            animation:
              bestt-ambient-pulse
              5s
              ease-in-out
              infinite;

            filter: blur(15px);
          }

          .bestt-cta-icon {
            animation:
              bestt-icon-float
              4s
              ease-in-out
              infinite;
          }

          /* ================================================================== */
          /* BUTTONS                                                             */
          /* ================================================================== */

          .bestt-button {
            position: relative;
            overflow: hidden;
            transform: translateZ(0);
          }

          .bestt-button::before {
            content: "";

            position: absolute;
            inset: 0;

            background:
              linear-gradient(
                110deg,
                transparent 25%,
                rgba(255, 255, 255, 0.13) 50%,
                transparent 75%
              );

            transform: translateX(-120%);

            transition:
              transform 700ms ease;
          }

          .bestt-button:hover::before {
            transform: translateX(120%);
          }

          .bestt-button > * {
            position: relative;
            z-index: 1;
          }

          /* ================================================================== */
          /* NAVIGATION                                                          */
          /* ================================================================== */

          .bestt-nav-link {
            position: relative;
          }

          .bestt-nav-link::after {
            content: "";

            position: absolute;

            left: 0;
            right: 0;
            bottom: -6px;

            height: 1.5px;

            background: #2563eb;

            transform: scaleX(0);
            transform-origin: right;

            transition:
              transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
          }

          .bestt-nav-link:hover::after {
            transform: scaleX(1);
            transform-origin: left;
          }

          /* ================================================================== */
          /* ACCESSIBILITY                                                       */
          /* ================================================================== */

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
              transition-duration: 0.01ms !important;
            }

            .bestt-reveal {
              opacity: 1;
              filter: none;
              transform: none;
            }
          }

          /* ================================================================== */
          /* MOBILE                                                              */
          /* ================================================================== */

          @media (max-width: 640px) {
            .bestt-hero-image {
              animation-duration: 24s;
            }

            .bestt-reveal-left,
            .bestt-reveal-right {
              transform: translate3d(0, 26px, 0);
            }

            .bestt-reveal-visible {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }
        `}
      </style>

      {/* ==================================================================== */}
      {/* NAVIGATION                                                            */}
      {/* ==================================================================== */}

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
              className="h-11 w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="bestt-nav-link text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-950"
            >
              How it works
            </a>

            <a
              href="#built-for"
              className="bestt-nav-link text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-950"
            >
              Built for
            </a>

            <Link
              to="/login"
              className="bestt-nav-link text-sm font-semibold text-slate-700 transition-colors duration-200 hover:text-blue-600"
            >
              Sign in
            </Link>

            <Link
              to="/register"
              className="bestt-button rounded-xl bg-[#0d1b3e] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#172b58] hover:shadow-lg active:translate-y-0"
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

      {/* ==================================================================== */}
      {/* HERO                                                                  */}
      {/* ==================================================================== */}

      <section className="relative isolate min-h-[680px] overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <img
            src="/bestt-study-group.jpg"
            alt=""
            aria-hidden="true"
            className="bestt-hero-image h-full w-full object-cover object-[center_45%]"
          />
        </div>

        {/* Readability layers */}
        <div className="absolute inset-0 -z-10 bg-slate-950/30" />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-slate-950/60 via-slate-950/25 to-slate-950/10" />

        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-slate-950/30 to-transparent" />

        {/* Atmospheric motion */}
        <div className="bestt-hero-glow-left absolute -left-32 top-24 -z-10 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl" />

        <div className="bestt-hero-glow-right absolute -right-20 bottom-10 -z-10 h-96 w-96 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-24 text-center lg:px-8 lg:pb-28 lg:pt-32">
          {/* Badge */}
          <div
            className="bestt-hero-badge bestt-reveal bestt-reveal-scale bestt-reveal-visible inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur-md"
            style={motionStyle(100)}
          >
            <BookOpen size={15} strokeWidth={2} />

            <span>Your intelligent study companion</span>
          </div>

          {/* Heading */}
          <h1
            className="bestt-reveal bestt-reveal-up bestt-reveal-visible mt-7 max-w-4xl text-5xl font-bold tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
            style={motionStyle(220)}
          >
            <span className="block">
              Your material.
            </span>

            <span className="bestt-hero-question mt-1 block">
              Your questions.
            </span>
          </h1>

          {/* Description */}
          <p
            className="bestt-reveal bestt-reveal-up bestt-reveal-visible mx-auto mt-7 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl"
            style={motionStyle(380)}
          >
            Bring your PDFs, webpages, notes and learning resources
            into one intelligent workspace. Ask questions, understand
            difficult ideas and study at your own pace.
          </p>

          {/* Actions */}
          <div
            className="bestt-reveal bestt-reveal-up bestt-reveal-visible mt-9 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
            style={motionStyle(520)}
          >
            <Link
              to="/register"
              className="bestt-button group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-950/25 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-500 hover:shadow-2xl hover:shadow-blue-950/30 active:translate-y-0 sm:w-auto"
            >
              <span>Start learning</span>

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/login"
              className="bestt-button group inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/50 hover:bg-white/15 active:translate-y-0 sm:w-auto"
            >
              <span>Sign in</span>
            </Link>
          </div>

          {/* Supporting text */}
          <p
            className="bestt-reveal bestt-reveal-up bestt-reveal-visible mt-6 text-xs font-medium tracking-wide text-slate-300"
            style={motionStyle(680)}
          >
            Built for students, researchers and curious minds.
          </p>

          {/* Scroll cue */}
          <div
            className="bestt-reveal bestt-reveal-scale bestt-reveal-visible bestt-scroll-cue mt-14 hidden h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 backdrop-blur-sm sm:flex"
            style={motionStyle(850)}
          >
            <ArrowRight
              size={16}
              className="rotate-90"
              strokeWidth={1.8}
            />
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* SOURCE CARDS                                                          */}
      {/* ==================================================================== */}

      <section
        id="how-it-works"
        className="border-y border-slate-200/80 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <Reveal
            className="mx-auto max-w-2xl text-center"
            direction="up"
          >
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
          </Reveal>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sources.map((source, index) => {
              const Icon = source.icon;

              return (
                <Reveal
                  key={source.title}
                  delay={index * 90}
                  direction="up"
                >
                  <div className="bestt-source-card group h-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl hover:shadow-slate-200/60">
                    <div className="relative z-10">
                      <div className="bestt-source-icon flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-600/20">
                        <Icon
                          size={21}
                          strokeWidth={1.9}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <h3 className="mt-5 font-semibold text-slate-900">
                          {source.title}
                        </h3>

                        <ArrowRight
                          size={15}
                          className="bestt-source-arrow mt-5 text-blue-600"
                        />
                      </div>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {source.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* CAPABILITIES                                                          */}
      {/* ==================================================================== */}

      <section className="bg-[#fafbfc]">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <Reveal direction="left">
              <div>
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
            </Reveal>

            <div className="space-y-4">
              {capabilities.map((capability, index) => {
                const Icon = capability.icon;

                return (
                  <Reveal
                    key={capability.title}
                    delay={index * 120}
                    direction="right"
                  >
                    <div className="bestt-capability-card group flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/60">
                      <div className="bestt-capability-icon flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white group-hover:bg-blue-600">
                        <Icon
                          size={20}
                          strokeWidth={1.9}
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
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* BUILT FOR                                                             */}
      {/* ==================================================================== */}

      <section
        id="built-for"
        className="relative overflow-hidden bg-slate-950 text-white"
      >
        <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-24">
          <Reveal className="mx-auto max-w-2xl text-center">
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
          </Reveal>

          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {audiences.map((audience, index) => (
              <Reveal
                key={audience.title}
                delay={index * 110}
                direction="scale"
              >
                <div className="bestt-audience-card group h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl hover:shadow-blue-950/20">
                  <div className="relative z-10">
                    <div className="bestt-audience-line mb-5 h-px w-8 bg-blue-500" />

                    <h3 className="font-semibold">
                      {audience.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-400">
                      {audience.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* FINAL CTA                                                             */}
      {/* ==================================================================== */}

      <section className="relative overflow-hidden bg-white">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bestt-cta-orb h-72 w-72 rounded-full bg-blue-500/10" />
        </div>

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
          <Reveal direction="scale">
            <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <BookOpen
                className="bestt-cta-icon"
                size={22}
                strokeWidth={1.9}
              />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Ready to study with BestT?
            </h2>
          </Reveal>

          <Reveal delay={180}>
            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
              Create your workspace and start turning your learning
              material into an interactive study experience.
            </p>
          </Reveal>

          <Reveal delay={280}>
            <Link
              to="/register"
              className="bestt-button group mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30"
            >
              <span>Get started</span>

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* FOOTER                                                                */}
      {/* ==================================================================== */}

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-8 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <Link
            to="/"
            aria-label="BestT home"
            className="group inline-flex items-center"
          >
            <img
              src="/bestt-logo.png"
              alt="BestT"
              className="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-[1.035]"
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

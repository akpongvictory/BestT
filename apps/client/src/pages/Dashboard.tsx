import {
  ArrowRight,
  BookOpen,
  Plus,
  Upload,
} from "lucide-react";
import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import CourseCard from "../components/CourseCard";
import CreateCourseModal from "../components/CreateCourseModal";

import { useCourses } from "../hooks/useCourse";
import { Course } from "../services/courses";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  const {
    data: courses = [],
    isLoading,
    error,
  } = useCourses();

  return (
    <DashboardLayout>
      <div className="space-y-10">

        {/* Hero */}
        <section className="relative overflow-hidden rounded-[32px] bg-[#0d1b3e] shadow-2xl shadow-[#0d1b3e]/10">
          {/* Background atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.22),transparent_30%),radial-gradient(circle_at_70%_100%,rgba(139,92,246,0.20),transparent_32%)]" />

          <div className="absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full border border-white/5" />
          <div className="absolute right-[-30px] top-[-50px] h-52 w-52 rounded-full border border-white/5" />

          <div className="relative flex flex-col justify-between gap-10 px-6 py-8 sm:px-9 sm:py-10 lg:flex-row lg:items-center lg:px-12 lg:py-12">

            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3.5 py-2 text-[11px] font-semibold tracking-wide text-blue-100">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/15">
  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
</span>
                YOUR INTELLIGENT LEARNING SPACE
              </div>

              <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl lg:text-[42px]">
                Learn with clarity.
                <span className="block bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Achieve more with BestT.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                Bring your course materials together, ask better
                questions and turn difficult topics into genuine
                understanding.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0d1b3e] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  <Plus size={17} />
                  Create a course
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.06] px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  <Upload size={16} />
                  Add material
                </button>
              </div>
            </div>

            {/* Mascot / brand moment */}
            <div className="hidden lg:flex lg:w-[270px] lg:justify-center">
              <div className="relative">
                <div className="absolute inset-0 scale-75 rounded-full bg-blue-400/20 blur-3xl" />

                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur-sm">
                  <img
                    src="/bestt-logo.png"
                    alt=""
                    className="w-44 object-contain"
                  />
                </div>

                <div className="absolute -right-3 top-5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-400/15">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Courses */}
        <section>
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">
                  Your workspace
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0d1b3e]">
                My Courses
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pick up where you left off or begin something new.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              <Plus size={17} />
              New course
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-700">
              We couldn't load your courses. Please try again.
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-56 animate-pulse rounded-3xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && courses.length === 0 && (
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />

              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 text-blue-600 shadow-sm">
                <BookOpen size={27} strokeWidth={1.7} />
              </div>

              <h3 className="relative mt-6 text-lg font-semibold text-[#0d1b3e]">
                Your learning space is waiting
              </h3>

              <p className="relative mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create a course and bring your notes, PDFs or
                other learning material into BestT.
              </p>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative mt-7 inline-flex items-center gap-2 rounded-xl bg-[#0d1b3e] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0d1b3e]/15 transition-all hover:-translate-y-0.5 hover:bg-[#142650]"
              >
                <Plus size={17} />
                Create your first course
              </button>
            </div>
          )}

          {/* Courses */}
          {!isLoading && !error && courses.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {courses.map((course: Course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <CreateCourseModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </DashboardLayout>
  );
}
import { BookOpen, Plus, Sparkles } from "lucide-react";
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
      <div className="space-y-8">

        {/* Welcome hero */}
        <section className="relative overflow-hidden rounded-3xl bg-[#0d1b3e] px-6 py-8 text-white shadow-xl shadow-slate-200 sm:px-8 sm:py-10">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-blue-100">
              <Sparkles size={14} className="text-cyan-300" />
              Your intelligent learning workspace
            </div>

            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Learn with clarity.
              <span className="block text-blue-300">
                Go further with BestT.
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Bring your study materials together, ask questions and turn
              complicated topics into understanding.
            </p>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0d1b3e] shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50"
            >
              <Plus size={18} />
              Create a course
            </button>
          </div>
        </section>

        {/* Course heading */}
        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">
                Your workspace
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-[#0d1b3e]">
                My Courses
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Pick up where you left off or start something new.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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
                  className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white"
                />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && courses.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <BookOpen size={25} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#0d1b3e]">
                Your learning space is empty
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first course and bring your notes, PDFs,
                webpages or other learning material into BestT.
              </p>

              <button
                type="button"
                onClick={() => setOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:bg-blue-700"
              >
                <Plus size={18} />
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
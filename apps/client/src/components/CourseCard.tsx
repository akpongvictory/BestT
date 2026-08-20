import {
  ArrowUpRight,
  BookOpen,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Course } from "../services/courses";

export default function CourseCard({
  course,
}: {
  course: Course;
}) {
  const navigate = useNavigate();

  const documentCount = course._count?.documents ?? 0;

  return (
    <button
      type="button"
      onClick={() => navigate(`/study/${course.id}`)}
      className="group relative w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/70 focus:outline-none focus:ring-4 focus:ring-blue-100"
    >
      {/* Subtle hover accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-600/20">
          <BookOpen size={20} strokeWidth={1.8} />
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-all duration-300 group-hover:bg-blue-50 group-hover:text-blue-600">
          <ArrowUpRight
            size={18}
            strokeWidth={1.8}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>

      {/* Course information */}
      <div className="mt-5">
        <h2 className="line-clamp-1 text-lg font-semibold tracking-tight text-[#0d1b3e]">
          {course.title}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
          {course.description || "Build your knowledge with BestT."}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <FileText
            size={14}
            strokeWidth={1.8}
            className="text-slate-400"
          />

          {documentCount}{" "}
          {documentCount === 1 ? "document" : "documents"}
        </span>

        <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          Open course
          <ArrowUpRight size={13} strokeWidth={2} />
        </span>
      </div>
    </button>
  );
}
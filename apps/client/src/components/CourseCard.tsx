import { ArrowUpRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Course } from "../services/courses";

export default function CourseCard({
  course,
}: {
  course: Course;
}) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/study/${course.id}`)}
      className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-blue-600">
          <FileText size={20} />
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-slate-400 transition-all duration-200 group-hover:bg-blue-50 group-hover:text-blue-600">
          <ArrowUpRight size={18} />
        </span>
      </div>

      <div className="mt-5">
        <h2 className="line-clamp-1 text-lg font-semibold text-[#0d1b3e]">
          {course.title}
        </h2>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-slate-500">
          {course.description || "Build your knowledge with BestT."}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <FileText size={14} />
          {course._count.documents}{" "}
          {course._count.documents === 1 ? "document" : "documents"}
        </span>

        <span className="text-xs font-semibold text-blue-600 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Open course
        </span>
      </div>
    </button>
  );
}
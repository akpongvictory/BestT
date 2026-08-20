import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Globe,
  Link as LinkIcon,
  MessageCircle,
  PlayCircle,
  Plus,
  Upload,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useCourse } from "../hooks/useCourse";

import { CourseHeader, DocumentList } from "../features/study";

import {
  UploadModal,
  useUploadDocument,
} from "../features/documents";

import { notify } from "../lib/toast";

export default function Study() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openUpload, setOpenUpload] = useState(false);

  const {
    data: course,
    isLoading,
    error,
  } = useCourse(courseId ?? "");

  const uploadMutation = useUploadDocument();

  if (!courseId) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            Invalid course.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
          <div className="h-56 animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm font-medium text-red-700">
            Failed to load course.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  async function handleUpload(file: File) {
    if (!courseId) {
      notify.error(
        "Invalid course",
        "This course could not be found."
      );
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        courseId,
        file,
      });

      await queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });

      notify.success(
        "Material added",
        `${file.name} was uploaded successfully.`
      );

      setOpenUpload(false);
    } catch (err: unknown) {
      console.error("Upload failed:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong while uploading. Please try again.";

      notify.error("Upload failed", message);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-10">
        {/* Back to dashboard */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#0d1b3e]"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </button>

        {/* Course header */}
        <CourseHeader
          title={course.title}
          description={course.description ?? undefined}
        />

        {/* ===================================================== */}
        {/* STUDY MATERIALS */}
        {/* ===================================================== */}

        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
                Your sources
              </p>

              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0d1b3e]">
                Study materials
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
                Everything BestT can use to help you learn this course.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpenUpload(true)}
              disabled={uploadMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0d1b3e] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0d1b3e]/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#172b58] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <Plus size={17} />
              Add material
            </button>
          </div>

          {/* Materials */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            {course.documents.length > 0 ? (
              <DocumentList documents={course.documents} />
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <BookOpen size={25} strokeWidth={1.8} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-[#0d1b3e]">
                  No study materials yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Add your notes, documents, webpages, or YouTube
                  resources. BestT will use them as the foundation
                  for your learning experience.
                </p>

                <button
                  type="button"
                  onClick={() => setOpenUpload(true)}
                  disabled={uploadMutation.isPending}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={17} />
                  Add your first material
                </button>
              </div>
            )}
          </div>

          {/* Source types */}
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Documents */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Documents
                </p>

                <p className="text-xs text-slate-500">
                  PDF, DOCX, TXT
                </p>
              </div>
            </div>

            {/* Web pages */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Globe size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Web pages
                </p>

                <p className="text-xs text-slate-500">
                  Learn from online sources
                </p>
              </div>
            </div>

            {/* YouTube */}
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <PlayCircle size={19} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800">
                  YouTube
                </p>

                <p className="text-xs text-slate-500">
                  Learn from video content
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================== */}
        {/* LEARNING WORKSPACE */}
        {/* ===================================================== */}

        <section className="space-y-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              Learn from your materials
            </p>

            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-[#0d1b3e]">
              Learning workspace
            </h2>

            <p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">
              Choose how you want to study. BestT will work with the
              materials you&apos;ve added to this course.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Chat */}
            <button
              type="button"
              onClick={() => navigate(`/study/${courseId}/chat`)}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <MessageCircle size={22} strokeWidth={1.8} />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#0d1b3e]">
                Chat with BestT
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ask questions, get explanations, and explore ideas
                from your course materials.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600">
                Open tutor
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>

            {/* Quiz */}
            <button
              type="button"
              onClick={() => navigate(`/quiz/${courseId}`)}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                <BookOpen size={22} strokeWidth={1.8} />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#0d1b3e]">
                Practice
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Test your understanding with questions generated
                from the material you&apos;re studying.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                Start practice
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>

            {/* Review */}
            <button
              type="button"
              onClick={() => {
                notify.info(
                  "Review is coming soon",
                  "For now, use Chat with BestT to review your materials."
                );
              }}
              className="group rounded-3xl border border-slate-200 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                <LinkIcon size={22} strokeWidth={1.8} />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-[#0d1b3e]">
                Review
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Turn your course materials into concise explanations
                and useful revision notes.
              </p>

              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-600">
                Review material
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </button>
          </div>
        </section>

        {/* ===================================================== */}
        {/* ADD MATERIAL */}
        {/* ===================================================== */}

        <section className="overflow-hidden rounded-3xl bg-[#0d1b3e] p-6 text-white shadow-xl shadow-[#0d1b3e]/10 sm:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">
                Build your knowledge base
              </p>

              <h2 className="mt-2 text-2xl font-semibold">
                Add more learning material
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                Bring together your notes, documents, websites, and
                YouTube resources in one course.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setOpenUpload(true)}
              disabled={uploadMutation.isPending}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0d1b3e] transition-all hover:-translate-y-0.5 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              <Upload size={17} />
              Add material
            </button>
          </div>
        </section>

        {/* Upload modal */}
        <UploadModal
          open={openUpload}
          onClose={() => {
            if (!uploadMutation.isPending) {
              setOpenUpload(false);
            }
          }}
          onUpload={handleUpload}
          isUploading={uploadMutation.isPending}
        />
      </div>
    </DashboardLayout>
  );
}
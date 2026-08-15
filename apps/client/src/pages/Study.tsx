import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../layouts/DashboardLayout";
import { useCourse } from "../hooks/useCourse";

import {
  CourseHeader,
  DocumentList,
  UploadButton,
  StudyActions,
} from "../features/study";

import {
  UploadModal,
  useUploadDocument,
} from "../features/documents";

import { askBestT } from "../services/chat";

export default function Study() {
  const { courseId } = useParams<{ courseId: string }>();

  const [open, setOpen] = useState(false);

  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [url, setUrl] = useState("");
  const [answer, setAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [chatError, setChatError] = useState("");

  const queryClient = useQueryClient();

  const {
    data: course,
    isLoading,
    error,
  } = useCourse(courseId!);

  const uploadMutation = useUploadDocument();

  if (!courseId) {
    return (
      <DashboardLayout>
        <p className="text-red-600">Invalid course.</p>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Loading course...</p>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <p className="text-red-600">Failed to load course.</p>
      </DashboardLayout>
    );
  }

  async function handleUpload(file: File) {
    try {
      await uploadMutation.mutateAsync({
        courseId: courseId!,
        file,
      });

      await queryClient.invalidateQueries({
        queryKey: ["course", courseId],
      });

      setOpen(false);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  }

  async function handleAskBestT() {
    if (!question.trim()) {
      setChatError("Please enter a question.");
      return;
    }

    if (!context.trim() && !url.trim()) {
      setChatError("Please provide study material or a URL.");
      return;
    }

    try {
      setIsAsking(true);
      setChatError("");
      setAnswer("");

      const result = await askBestT({
        question: question.trim(),
        context: context.trim() || undefined,
        url: url.trim() || undefined,
      });

      if (!result.success || !result.data?.answer) {
        throw new Error(
          result.message ?? "BestT could not generate an answer."
        );
      }

      setAnswer(result.data.answer);
    } catch (err) {
      console.error("BestT chat error:", err);

      if (err instanceof Error) {
        setChatError(err.message);
      } else {
        setChatError("Failed to get a response from BestT.");
      }
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <CourseHeader
          title={course.title}
          description={course.description ?? undefined}
        />

        <DocumentList documents={course.documents} />

        <UploadButton onClick={() => setOpen(true)} />

        <StudyActions />

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Ask BestT
            </h2>

            <p className="mt-1 text-sm text-gray-600">
              Ask a question using your notes, study material, or a
              webpage. You can also paste a YouTube video link.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="bestt-question"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Your question
              </label>

              <textarea
                id="bestt-question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                placeholder="What would you like BestT to explain?"
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label
                htmlFor="bestt-url"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Source URL
              </label>

              <input
                id="bestt-url"
                type="url"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://en.wikipedia.org/wiki/Photosynthesis"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1 text-xs text-gray-500">
                Paste a webpage or YouTube video link for BestT to
                use as learning material.
              </p>
            </div>

            <div>
              <label
                htmlFor="bestt-context"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Study material
              </label>

              <textarea
                id="bestt-context"
                value={context}
                onChange={(event) => setContext(event.target.value)}
                placeholder="Paste your notes or study material here..."
                rows={5}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {chatError && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {chatError}
              </div>
            )}

            <button
              type="button"
              onClick={handleAskBestT}
              disabled={isAsking}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAsking ? "BestT is thinking..." : "Ask BestT"}
            </button>
          </div>

          {answer && (
            <div className="mt-8 rounded-xl bg-blue-50 p-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                BestT&apos;s Answer
              </h3>

              <div className="whitespace-pre-wrap leading-7 text-gray-800">
                {answer}
              </div>
            </div>
          )}
        </section>

        <UploadModal
          open={open}
          onClose={() => setOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    </DashboardLayout>
  );
}
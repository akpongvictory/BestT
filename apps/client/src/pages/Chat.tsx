import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bot,
  Send,
  User,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useCourse } from "../hooks/useCourse";
import api from "../lib/api";

interface Source {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  similarity: number;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

export default function Chat() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    data: course,
    isLoading: isCourseLoading,
  } = useCourse(courseId ?? "");

  useEffect(() => {
  if (!courseId) {
    return;
  }

  async function loadChatHistory() {
    try {
      const response = await api.get(
        `/chat/history/${courseId}`
      );

      const data = response.data?.data;

      if (!data?.messages) {
        return;
      }

      setMessages(
        data.messages.map(
          (message: {
            id: string;
            role: "user" | "assistant";
            content: string;
            createdAt: string;
          }) => ({
            role: message.role,
            content: message.content,
          })
        )
      );
    } catch (err) {
      console.error(
        "Failed to load chat history:",
        err
      );
    }
  }

  loadChatHistory();
}, [courseId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || !courseId || isLoading) {
      return;
    }

    setError("");

    const userMessage: Message = {
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((current) => [
      ...current,
      userMessage,
    ]);

    setQuestion("");
    setIsLoading(true);

    try {
      const response = await api.post("/chat", {
        question: trimmedQuestion,
        courseId,
      });

      const data = response.data?.data;

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data?.answer ??
            "I couldn't generate a response.",
          sources: data?.sources ?? [],
        },
      ]);
    } catch (err: any) {
      console.error("Chat request failed:", err);

      const message =
        err?.response?.data?.message ??
        "Failed to generate a tutor response.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

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

  if (isCourseLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="h-8 w-64 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-[500px] animate-pulse rounded-3xl bg-white shadow-sm" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-5xl flex-col">

        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate(`/study/${courseId}`)}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-[#0d1b3e]"
          >
            <ArrowLeft size={16} />
            Back to study
          </button>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-600">
              BestT Tutor
            </p>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[#0d1b3e]">
              Chat with BestT
            </h1>

            {course && (
              <p className="mt-1 text-sm text-slate-500">
                Ask questions about{" "}
                <span className="font-medium text-slate-700">
                  {course.title}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Chat container */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

          {/* Messages */}
          <div className="flex-1 space-y-6 overflow-y-auto p-5 sm:p-8">

            {messages.length === 0 && (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Bot size={30} strokeWidth={1.7} />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-[#0d1b3e]">
                  Your course tutor is ready
                </h2>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Ask questions about your uploaded course materials.
                  BestT will retrieve the most relevant sections and
                  use them to answer your question.
                </p>

                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {[
                    "What is the main topic?",
                    "Explain this material simply.",
                    "What should I remember?",
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setQuestion(suggestion)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Bot size={18} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#0d1b3e] text-white"
                      : "rounded-bl-md bg-slate-50 text-slate-700"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-7">
                    {message.content}
                  </p>

                  {message.sources &&
                    message.sources.length > 0 && (
                      <div className="mt-4 border-t border-slate-200 pt-3">
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Sources
                        </p>

                        <div className="space-y-1">
                          {message.sources.map(
                            (source, sourceIndex) => (
                              <p
                                key={`${source.documentId}-${source.chunkIndex}-${sourceIndex}`}
                                className="text-xs text-slate-500"
                              >
                                {sourceIndex + 1}.{" "}
                                {source.documentName}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>

                {message.role === "user" && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0d1b3e] text-white">
                    <User size={17} />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Bot size={18} />
                </div>

                <div className="rounded-2xl rounded-bl-md bg-slate-50 px-5 py-4">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "120ms" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
                      style={{ animationDelay: "240ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white p-4 sm:p-5"
          >
            <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition-colors focus-within:border-blue-300 focus-within:bg-white">
              <textarea
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                placeholder="Ask BestT about your course..."
                rows={2}
                maxLength={4000}
                disabled={isLoading}
                className="min-h-[48px] flex-1 resize-none border-0 bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:opacity-50"
              />

              <button
                type="submit"
                disabled={!question.trim() || isLoading}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>

            <p className="mt-2 px-2 text-[11px] text-slate-400">
              Press Enter to send · Shift + Enter for a new line
            </p>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
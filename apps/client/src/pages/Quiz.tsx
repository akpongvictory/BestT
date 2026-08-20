import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import {
  getQuiz,
  generateQuiz,
  submitQuiz,
} from "../api/quiz";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  explanation?: string | null;
}

interface QuizData {
  id: string;
  title: string;
  description?: string | null;
  questions: QuizQuestion[];
}

interface QuizResult {
  questionId: string;
  selectedAnswer: string | null;
  correct: boolean;
  explanation?: string | null;
}

interface SubmissionResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  results: QuizResult[];
}

export default function Quiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [result, setResult] =
    useState<SubmissionResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!courseId) return;

    const loadQuiz = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getQuiz(courseId);

        setQuiz(response.data.data);
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setQuiz(null);
        } else {
          setError(
            err?.response?.data?.message ??
              "Failed to load quiz."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [courseId]);

  const handleGenerate = async () => {
    if (!courseId) return;

    try {
      setGenerating(true);
      setError("");

      const response = await generateQuiz(courseId);

      setQuiz(response.data.data);
      setAnswers({});
      setResult(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Failed to generate quiz."
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleAnswer = (
    questionId: string,
    answer: string
  ) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    if (
      Object.keys(answers).length !==
      quiz.questions.length
    ) {
      setError(
        "Please answer every question before submitting."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await submitQuiz(
        quiz.id,
        answers
      );

      setResult(response.data.data);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Failed to submit quiz."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-sm text-gray-500">
            Loading quiz...
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() =>
              courseId &&
              navigate(`/study/${courseId}`)
            }
            className="mb-5 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            ← Back to study
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-600">
                QUIZ
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {result
                  ? "Quiz Results"
                  : quiz?.title ?? "Course Quiz"}
              </h1>

              {!result && quiz?.description && (
                <p className="mt-2 text-gray-500">
                  {quiz.description}
                </p>
              )}
            </div>

            {quiz && !result && (
              <div className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600">
                {Object.keys(answers).length} /{" "}
                {quiz.questions.length} answered
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* No quiz */}
        {!quiz && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📝
            </div>

            <h2 className="text-xl font-semibold text-gray-900">
              No quiz yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Generate a quiz from your uploaded course
              material and test your understanding.
            </p>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating
                ? "Generating quiz..."
                : "Generate Quiz"}
            </button>
          </div>
        )}

        {/* Results */}
        {quiz && result && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-gray-900 p-8 text-white">
              <p className="text-sm text-gray-400">
                Your score
              </p>

              <div className="mt-2 flex items-end gap-3">
                <span className="text-5xl font-bold">
                  {result.percentage}%
                </span>

                <span className="mb-1 text-gray-400">
                  {result.score} /{" "}
                  {result.totalQuestions} correct
                </span>
              </div>
            </div>

            {quiz.questions.map((question, index) => {
              const questionResult =
                result.results.find(
                  (item) =>
                    item.questionId === question.id
                );

              return (
                <div
                  key={question.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <div className="mb-5 flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600">
                      {index + 1}
                    </span>

                    <h2 className="font-semibold leading-6 text-gray-900">
                      {question.question}
                    </h2>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option) => {
                      const selected =
                        questionResult?.selectedAnswer ===
                        option;

                      const correct =
                        questionResult?.correct &&
                        selected;

                      return (
                        <div
                          key={option}
                          className={`rounded-xl border px-4 py-3 text-sm ${
                            correct
                              ? "border-green-300 bg-green-50 text-green-800"
                              : selected
                              ? "border-red-300 bg-red-50 text-red-800"
                              : "border-gray-200 text-gray-600"
                          }`}
                        >
                          {option}
                        </div>
                      );
                    })}
                  </div>

                  {questionResult?.explanation && (
                    <div className="mt-5 rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                      <span className="font-semibold">
                        Explanation:
                      </span>{" "}
                      {questionResult.explanation}
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={() => {
                setResult(null);
                setAnswers({});
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
              className="w-full rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Retake Quiz
            </button>
          </div>
        )}

        {/* Quiz */}
        {quiz && !result && (
          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-6 flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-600">
                    {index + 1}
                  </span>

                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    {question.question}
                  </h2>
                </div>

                <div className="grid gap-3">
                  {question.options.map(
                    (option, optionIndex) => {
                      const selected =
                        answers[question.id] === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() =>
                            handleAnswer(
                              question.id,
                              option
                            )
                          }
                          className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left text-sm transition ${
                            selected
                              ? "border-blue-500 bg-blue-50 text-blue-800"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                              selected
                                ? "border-blue-500 bg-blue-600 text-white"
                                : "border-gray-300 text-gray-500"
                            }`}
                          >
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                          </span>

                          <span>{option}</span>
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            ))}

            <div className="sticky bottom-4">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-xl bg-blue-600 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Quiz"}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
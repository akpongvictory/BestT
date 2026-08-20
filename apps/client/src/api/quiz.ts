import api from "./axios";

export const getQuiz = (courseId: string) =>
  api.get(`/quiz/${courseId}`);

export const generateQuiz = (courseId: string) =>
  api.post(`/quiz/${courseId}/generate`);

export const submitQuiz = (
  quizId: string,
  answers: Record<string, string>
) =>
  api.post(`/quiz/${quizId}/submit`, {
    answers,
  });
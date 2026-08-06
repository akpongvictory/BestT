import api from "./axios";

export const getQuiz = (courseId: string) =>
    api.get(`/quiz/${courseId}`);

export const submitQuiz = (
    quizId: string,
    answers: any
) =>
    api.post(`/quiz/${quizId}/submit`, answers);
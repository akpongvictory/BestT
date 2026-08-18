import api from "../lib/api";

export interface ChatSource {
  documentId: string;
  documentName: string;
  chunkIndex: number;
  similarity: number;
}

export interface ChatRequest {
  question: string;
  courseId?: string;
  context?: string;
  url?: string;
}

export interface ChatResponse {
  success: boolean;

  data?: {
    answer: string;
    sources?: ChatSource[];
  };

  message?: string;
}

export async function askBestT(
  payload: ChatRequest
): Promise<ChatResponse> {
  const response = await api.post<ChatResponse>(
    "/chat",
    payload
  );

  return response.data;
}
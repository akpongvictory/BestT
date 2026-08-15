import api from "../lib/api";

export interface ChatRequest {
  question: string;
  context?: string;
  url?: string;
}

export interface ChatResponse {
  success: boolean;
  data?: {
    answer: string;
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
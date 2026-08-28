import axios from "axios";

interface ApiErrorResponse {
  message?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ??
      error.message ??
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

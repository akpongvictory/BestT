// Shared Utilities for BestT

export const APP_NAME = 'BestT';
export const APP_DESCRIPTION = 'AI-powered personalized learning companion';

export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
) {
  return {
    success,
    ...(data !== undefined && { data }),
    ...(message && { message }),
    ...(error && { error }),
  };
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

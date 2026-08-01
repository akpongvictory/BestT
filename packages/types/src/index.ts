// Shared Domain Interfaces for BestT

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  filename: string;
  courseId: string;
  createdAt: Date;
}

export interface DocumentChunk {
  id: string;
  content: string;
  embedding?: string | null;
  documentId: string;
  createdAt: Date;
}

export interface Quiz {
  id: string;
  title: string;
  courseId: string;
  createdAt: Date;
}

export interface Progress {
  id: string;
  score: number;
  userId: string;
  createdAt: Date;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  database: string;
}

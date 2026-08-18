export interface StudyDocument {
  id: string;
  filename: string;
  originalName?: string;
  fileType?: string;
  fileUrl?: string;
  fileSize?: number | null;
  processingStatus?:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyCourse {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  documents: StudyDocument[];
}
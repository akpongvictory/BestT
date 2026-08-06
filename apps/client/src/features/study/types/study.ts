export interface StudyDocument {
  id: string;
  filename: string;
  createdAt?: string;
}

export interface StudyCourse {
  id: string;
  title: string;
  description?: string;
  createdAt?: string;
  documents: StudyDocument[];
}
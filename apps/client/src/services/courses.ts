import api from "../lib/api";

export interface CourseDocument {
  id: string;
  filename: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number | null;
  processingStatus:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "FAILED";
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;

  documents: CourseDocument[];

  _count?: {
    documents: number;
  };
}

export const getCourses = async () => {
  const res = await api.get("/courses");

  return res.data.data as Course[];
};

export const getCourse = async (id: string) => {
  const res = await api.get(`/courses/${id}`);

  return res.data.data as Course;
};

export const createCourse = async (data: {
  title: string;
  description?: string;
}) => {
  const res = await api.post("/courses", data);

  return res.data.data as Course;
};

export const updateCourse = async (
  id: string,
  data: {
    title?: string;
    description?: string;
  }
) => {
  const res = await api.patch(
    `/courses/${id}`,
    data
  );

  return res.data.data as Course;
};

export const deleteCourse = async (
  id: string
) => {
  await api.delete(`/courses/${id}`);
};
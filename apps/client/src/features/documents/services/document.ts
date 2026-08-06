import api from "../../../lib/api";

export async function uploadDocument(
  courseId: string,
  file: File
) {
  const formData = new FormData();

  formData.append("file", file);

  const res = await api.post(
    `/courses/${courseId}/documents`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.data;
}
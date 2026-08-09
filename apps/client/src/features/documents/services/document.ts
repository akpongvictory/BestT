import api from "../../../lib/api";

export async function uploadDocument({
  courseId,
  file,
}: {
  courseId: string;
  file: File;
}) {
  const formData = new FormData();

  formData.append("courseId", courseId);
  formData.append("file", file);

  const response = await api.post(
    "/documents/upload",
    formData
  );

  return response.data;
}

export async function deleteDocument(
  documentId: string
) {
  const response = await api.delete(
    `/documents/${documentId}`
  );

  return response.data;
}
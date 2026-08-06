import { useMutation } from "@tanstack/react-query";
import { uploadDocument } from "../services/document";

export function useUploadDocument() {
  return useMutation({
    mutationFn: ({
      courseId,
      file,
    }: {
      courseId: string;
      file: File;
    }) => uploadDocument(courseId, file),
  });
}
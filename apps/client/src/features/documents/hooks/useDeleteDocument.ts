import { useMutation } from "@tanstack/react-query";
import { deleteDocument } from "../services/document";

export function useDeleteDocument() {
  return useMutation({
    mutationFn: (documentId: string) =>
      deleteDocument(documentId),
  });
}
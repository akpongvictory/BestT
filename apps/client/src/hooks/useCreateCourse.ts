import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { createCourse } from "../services/courses";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCourse,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      toast.success("Course created", {
        description:
          "Your new learning space is ready. You can start adding material.",
      });
    },

    onError: (error: any) => {
      toast.error("Couldn't create course", {
        description:
          error?.response?.data?.message ??
          error?.message ??
          "Something went wrong. Please try again.",
      });
    },
  });
}
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useCreateCourse } from "../hooks/useCreateCourse";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormData {
  title: string;
  description: string;
}

export default function CreateCourseModal({
  open,
  onClose,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  const createCourse = useCreateCourse();

  const onSubmit = async (data: FormData) => {
    try {
      await createCourse.mutateAsync(data);

      reset();
      onClose();

      toast.success("Course created successfully.", {
        description: `"${data.title}" is now in your workspace.`,
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ??
          error?.message ??
          "Unable to create the course. Please try again."
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
            New workspace
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0d1b3e]">
            Create a course
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Give your learning space a name and start adding your material.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Course title
            </label>

            <input
              autoFocus
              placeholder="e.g. Human Anatomy"
              className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
                errors.title
                  ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                  : "border-slate-200 focus:border-blue-500 focus:ring-blue-50"
              }`}
              {...register("title", {
                required: "Course title is required",
                maxLength: {
                  value: 100,
                  message: "Course title cannot exceed 100 characters.",
                },
              })}
            />

            {errors.title && (
              <p className="mt-2 text-xs text-red-600">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
              <span className="ml-1 font-normal text-slate-400">
                (optional)
              </span>
            </label>

            <textarea
              rows={4}
              placeholder="What are you learning in this course?"
              className="w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              {...register("description")}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createCourse.isPending}
              className="rounded-xl bg-[#0d1b3e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#142650] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createCourse.isPending
                ? "Creating..."
                : "Create course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
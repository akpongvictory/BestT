import { useForm } from "react-hook-form";
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
    await createCourse.mutateAsync(data);

    reset();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-2xl font-bold">
          Create Course
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block font-medium">
              Title
            </label>

            <input
              className="w-full rounded-lg border p-3"
              {...register("title", {
                required: "Course title is required",
                maxLength: 100,
              })}
            />

            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <textarea
              rows={4}
              className="w-full rounded-lg border p-3"
              {...register("description")}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createCourse.isPending}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
            >
              {createCourse.isPending
                ? "Creating..."
                : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
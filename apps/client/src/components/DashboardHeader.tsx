import { useAuth } from "../hooks/useAuth";

interface Props {
  onCreateCourse: () => void;
}

export default function DashboardHeader({
  onCreateCourse,
}: Props) {
  const { user } = useAuth();

  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.name}
        </h1>

        <p className="text-gray-500">
          Continue your learning journey.
        </p>
      </div>

      <button
        onClick={onCreateCourse}
        className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
      >
        + New Course
      </button>
    </div>
  );
}
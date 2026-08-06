import { useNavigate } from "react-router-dom";
import { Course } from "../services/courses";

export default function CourseCard({
  course,
}: {
  course: Course;
}) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/study/${course.id}`)}
      className="cursor-pointer rounded-xl border bg-white p-6 shadow transition hover:shadow-lg"
    >
      <h2 className="text-xl font-bold">
        {course.title}
      </h2>

      <p className="mt-2 text-gray-600">
        {course.description || "No description"}
      </p>

      <div className="mt-5 flex justify-between text-sm text-gray-500">
        <span>
          📄 {course._count.documents} documents
        </span>

        <span>
          →
        </span>
      </div>
    </div>
  );
}
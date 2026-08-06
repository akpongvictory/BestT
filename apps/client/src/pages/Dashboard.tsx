import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import CourseCard from "../components/CourseCard";
import CreateCourseModal from "../components/CreateCourseModal";

import { useCourses } from "../hooks/useCourse";
import { Course } from "../services/courses";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  const {
    data: courses = [],
    isLoading,
    error,
  } = useCourses();

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Failed to load courses.
        </p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          My Courses
        </h1>

        <button
          onClick={() => setOpen(true)}
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + New Course
        </button>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course: Course) => (
            <CourseCard
              key={course.id}
              course={course}
            />
          ))}
        </div>
      )}

      <CreateCourseModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </DashboardLayout>
  );
}
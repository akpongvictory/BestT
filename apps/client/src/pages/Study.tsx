import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../layouts/DashboardLayout";
import { useCourse } from "../hooks/useCourse";

import {
  CourseHeader,
  DocumentList,
  UploadButton,
  StudyActions,
} from "../features/study";

import {
  UploadModal,
  useUploadDocument,
} from "../features/documents";

export default function Study() {
  const { courseId } = useParams<{ courseId: string }>();

  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: course,
    isLoading,
    error,
  } = useCourse(courseId!);

  const uploadMutation = useUploadDocument();

  if (!courseId) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Invalid course.
        </p>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <p>Loading course...</p>
      </DashboardLayout>
    );
  }

  if (error || !course) {
    return (
      <DashboardLayout>
        <p className="text-red-500">
          Failed to load course.
        </p>
      </DashboardLayout>
    );
  }

async function handleUpload(file: File) {
  try {
    await uploadMutation.mutateAsync({
      courseId: courseId!,
      file,
    });

    await queryClient.invalidateQueries({
      queryKey: ["course", courseId!],
    });

    setOpen(false);
  } catch (err) {
    console.error(err);
    alert("Upload failed.");
  }
}

  return (
    <DashboardLayout>
      <CourseHeader
        title={course.title}
        description={course.description}
      />

      <DocumentList
        documents={course.documents}
      />

      <UploadButton
        onClick={() => setOpen(true)}
      />

      <StudyActions />

      <UploadModal
        open={open}
        onClose={() => setOpen(false)}
        onUpload={handleUpload}
      />
    </DashboardLayout>
  );
}
import { StudyDocument } from "../types/study";

interface Props {
  document: StudyDocument;
}

export default function DocumentCard({
  document,
}: Props) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="font-medium">
        📄 {document.filename}
      </h3>

      {document.createdAt && (
        <p className="mt-2 text-sm text-gray-500">
          Uploaded{" "}
          {new Date(document.createdAt).toLocaleDateString()}
        </p>
      )}

      <div className="mt-4 flex gap-2">
        <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700">
          Study
        </button>

        <button className="rounded border px-3 py-1 text-sm hover:bg-gray-100">
          Delete
        </button>
      </div>
    </div>
  );
}
import DocumentCard from "./DocumentCard";
import EmptyDocuments from "./EmptyDocuments";
import { StudyDocument } from "../types/study";

interface Props {
  documents: StudyDocument[];
}

export default function DocumentList({
  documents,
}: Props) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-2xl font-semibold">
        Documents
      </h2>

      {documents.length === 0 ? (
        <EmptyDocuments />
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
            />
          ))}
        </div>
      )}
    </section>
  );
}
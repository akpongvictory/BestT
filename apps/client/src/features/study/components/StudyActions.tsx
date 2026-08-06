export default function StudyActions() {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-2xl font-semibold">
        Workspace
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        <button className="rounded-xl border bg-white p-6 text-left shadow-sm transition hover:shadow-md">
          <h3 className="font-semibold">
            🤖 Chat with AI
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Ask questions about your study materials.
          </p>
        </button>

        <button className="rounded-xl border bg-white p-6 text-left shadow-sm transition hover:shadow-md">
          <h3 className="font-semibold">
            📝 Generate Quiz
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Create quizzes from uploaded documents.
          </p>
        </button>

        <button className="rounded-xl border bg-white p-6 text-left shadow-sm transition hover:shadow-md">
          <h3 className="font-semibold">
            📊 Progress
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Track your learning progress.
          </p>
        </button>
      </div>
    </section>
  );
}
interface Props {
  title: string;
  description?: string;
}

export default function CourseHeader({
  title,
  description,
}: Props) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      <p className="mt-2 text-gray-600">
        {description || "No description"}
      </p>
    </header>
  );
}
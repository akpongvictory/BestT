interface Props {
  title: string;
  value: number;
  color?: string;
}

export default function StatsCard({
  title,
  value,
  color = "bg-blue-600",
}: Props) {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <p className="text-gray-500">{title}</p>

      <h2 className={`mt-3 text-4xl font-bold ${color.replace("bg-", "text-")}`}>
        {value}
      </h2>
    </div>
  );
}
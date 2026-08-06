import DashboardLayout from "../layouts/DashboardLayout";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>

      <p className="mt-4 text-gray-600">
        Welcome to BestT.
      </p>
    </DashboardLayout>
  );
}
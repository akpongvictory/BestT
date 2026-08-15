import { ReactNode } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
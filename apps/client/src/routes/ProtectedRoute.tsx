import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" />
          Loading BestT...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
}
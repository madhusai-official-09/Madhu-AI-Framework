import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "./LoadingScreen";

interface Props {
  children: React.ReactNode;
  roles?: Array<"officer" | "victim" | "criminal">;
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <LoadingScreen
        title="Loading protected module"
        subtitle="Preparing authorized records and workspace state..."
      />
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role))
    return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}

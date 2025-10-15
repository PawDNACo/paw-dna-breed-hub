import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

export const QAProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, isQA, isDeveloper } = useUserRole();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsChecking(false);
    }
  }, [loading]);

  if (isChecking || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isQA && !isDeveloper) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

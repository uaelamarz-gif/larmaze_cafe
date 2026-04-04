import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
     children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
     const { isAuthenticated, loading } = useAuth();

     if (loading) {
          return null;
     }

     if (!isAuthenticated) {
          return <Navigate to="/admin/login" replace />;
     }

     return children;
};

export default ProtectedRoute;

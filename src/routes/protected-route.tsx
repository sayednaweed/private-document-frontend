import { UserPermission } from "@/database/tables";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  element: React.ReactNode;
  routeName: string;
  permissions: Map<string, UserPermission>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  routeName,
  permissions,
}) => {
  const isAllowed = permissions.get(routeName);

  return isAllowed ? element : <Navigate to="/unauthorized" replace />;
};
export default ProtectedRoute;

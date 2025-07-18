import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export const RoleProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated,  user, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated) return <Navigate to="/" replace />;
    // Normaliza el campo de rol
    const userRol = user?.usu_rol || user?.rol || "";
    if (!allowedRoles.includes(userRol)) return <Navigate to="/inicio/general" replace />;

    return <Outlet />;
};
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

export const ProtectedRoute = () => {
  const { isAuthenticated, loading,user } = useAuth();
  //console.log(isAuthenticated,loading,user)

  if (loading) return <h1>Loading...</h1>;
  if (!isAuthenticated && !loading) return <Navigate to="/" replace />;
  
  return <Outlet />;
  //Se retorna el componente Outlet para renderizar las rutas hijas
  //Outlet:  permite envolver muchas rutas con una lógica común 
  //(En este caso: protegerlas con autenticación)
  // sin tener que duplicar esa lógica en cada ruta individual.
};
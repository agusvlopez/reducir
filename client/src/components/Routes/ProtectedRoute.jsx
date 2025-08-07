import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";

export const ProtectedRoute = () => {
  const { accessToken } = useAuth();
  
  // Si no hay token, redirige a la página de login.
  // El prop 'replace' evita que el usuario pueda volver a la página anterior con el botón de "atrás" del navegador.
  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
}

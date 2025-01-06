// src/hooks/useRoleProtection.ts

import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Role, rolePermissions } from "./config/rolePermissions";

// Hook para verificar acceso basado en roles
const useRoleProtection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Obtener los roles desde el LocalStorage
    const roles = {
      isAdminUsuario: localStorage.getItem("isAdminUsuario") === "true",
      isCliente: localStorage.getItem("isCliente") === "true",
      isAdminRecarga: localStorage.getItem("isAdminRecarga") === "true",
      isAdminPartido: localStorage.getItem("isAdminPartido") === "true",
    };

    const currentPath = location.pathname;

    // Combinar todas las rutas permitidas según los roles del usuario
    const allowedPaths = Object.entries(roles).reduce((acc, [role, hasRole]) => {
      if (hasRole) {
        return acc.concat(rolePermissions[role as Role]);
      }
      return acc;
    }, [] as string[]);

    // Si el usuario no tiene acceso a la ruta actual, redireccionar según su rol
    if (!allowedPaths.includes(currentPath)) {
      if (roles.isAdminUsuario || roles.isAdminRecarga || roles.isAdminPartido) {
        navigate("/");
      } else if (roles.isCliente) {
        navigate("/cliente/home");
      } else {
        // Si no tiene ningún rol, redirigir a la página de login
        alert("No tienes permisos para acceder a esta página");
        navigate("/user/login");
      }
    }
  }, [navigate, location]);
};

export default useRoleProtection;

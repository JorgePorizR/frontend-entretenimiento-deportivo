// src/config/rolePermissions.ts

// Definir los posibles roles como un tipo
export type Role = "isAdminUsuario" | "isCliente" | "isAdminRecarga" | "isAdminPartido";

export const rolePermissions: Record<Role, string[]> = {
  isAdminUsuario: [
    "/",
    "/admin/usuarios/crud",
  ],
  isCliente: [
    "/cliente/home",
    "/cliente/ligas/:id",
    "/cliente/equipo/:id",
    "/cliente/partido/:id",
    "/cliente/historial/:id",
  ],
  isAdminRecarga: [
    "/",
    "/admin/recargas/home",
    "/admin/recargas/historial",
  ],
  isAdminPartido: [
    "/",
    "/admin/partidos/home",
    "/admin/partidos/clientes",
  ],
};

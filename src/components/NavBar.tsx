import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import HomeIcon from "./icons/HomeIcon";
import UserIcon from "./icons/UserIcon";
import { useState } from "react";
import { UserInfo } from "../models/user/UserInfo";

interface NavBarProps {
  usuario?: UserInfo | null; // Prop opcional
  cliente?: UserInfo | null; // Prop opcional
}

function NavBar({ usuario, cliente }: NavBarProps) {
  const navigate = useNavigate();
  const { logout, username } = useAuth({ redirectWithoutToken: false });

  // Estado para controlar la visibilidad del menú de opciones (Logout y otras opciones)
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Función para verificar permisos
  const tienePermiso = (nombreGrupo: string) => {
    return usuario?.groups.some((group) => group.name === nombreGrupo);
  };

  // Función para manejar clics con verificación de permisos
  const manejarClick = (nombreGrupo: string, ruta: string) => {
    if (tienePermiso(nombreGrupo)) {
      navigate(ruta);
    } else {
      alert(`No tienes el Rol de '${nombreGrupo}' para acceder a esta sección.`);
    }
  };

  // Función para alternar la visibilidad del menú
  const toggleMenuVisibility = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const onLogoutClick = () => {
    logout();
  };

  return (
    <header className="mt-0 mx-auto w-full max-w-screen-md border border-gray-700 bg-gray-900/80 py-3 shadow-lg backdrop-blur-lg md:rounded-3xl lg:max-w-screen-lg">
      <div className="px-4">
        <div className="flex items-center justify-between">
          <a
            aria-current="page"
            className="flex shrink-0 text-gray-300 hover:bg-gray-800 hover:text-white rounded-full p-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <HomeIcon />
          </a>
          <div className="flex items-center justify-end gap-3">
            {/* Mostrar estas opciones solo si `usuario` está presente */}
            {usuario && (
              <>
                <span className="items-center justify-center rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 inline-flex gap-2">
                  SISTEMAS DE:
                </span>
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
                  onClick={() => manejarClick("recarga", "/admin/recargas/home")}
                >
                  Recarga
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
                  onClick={() => manejarClick("administrador de partidos", "/admin/partidos/home")}
                >
                  Administrador de Partidos
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
                  onClick={() => manejarClick("administrador de usuarios", "/admin/usuarios/crud")}
                >
                  Administrador de Usuarios
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
                  onClick={() => manejarClick("cliente", "/cliente/home")}
                >
                  Cliente
                </button>
              </>
            )}
            {username ? (
              <>
                {/* Al hacer clic en el nombre de usuario, alterna la visibilidad del menú */}
                <span
                  className="hidden items-center justify-center rounded-xl bg-gray-800 px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-600 transition-all duration-150 hover:bg-gray-700 sm:inline-flex gap-2 cursor-pointer"
                  onClick={toggleMenuVisibility}
                >
                  {username}
                  <UserIcon />
                </span>

                {/* Mostrar el menú de opciones, incluyendo Logout */}
                {isMenuVisible && (
                  <div className="absolute bg-gray-800 rounded-xl shadow-lg mt-1 p-2 flex flex-col gap-2 top-11">
                    {
                      cliente && (
                        <button
                          className="inline-flex items-center justify-center rounded-xl bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600"
                          onClick={() => navigate(`/cliente/historial/${cliente.id}`)}
                        >
                          Historial
                        </button>
                      )
                    }
                    <button
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                      onClick={onLogoutClick}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  onClick={() => navigate("/user/login")}
                >
                  Login
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  onClick={() => navigate("/user/register")}
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default NavBar;

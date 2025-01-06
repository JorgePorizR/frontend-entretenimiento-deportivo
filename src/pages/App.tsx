import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { UserService } from "../services/UserService";
import NavBar from "../components/NavBar";
import useAdminProtection from "../navigation/useAdminProtection";
import fondo from "../assets/fondoparaadmin2.webp";
import { UserInfo } from "../models/user/UserInfo";

function App() {
  useAdminProtection();
  useAuth({ redirectWithoutToken: true });
  const [usuario, setUsuario] = useState<UserInfo | null>(null);

  useEffect(() => {
    new UserService()
      .getInfoUser()
      .then((response) => {
        localStorage.setItem("isAdminUsuario", response.is_admin_usuario.toString());
        localStorage.setItem("isAdminRecarga", response.is_admin_recarga.toString());
        localStorage.setItem("isAdminPartido", response.is_admin_partido.toString());
        localStorage.setItem("isCliente", response.is_cliente.toString());
        setUsuario(response);
        console.log("Usuario: ", response);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-black">
      <NavBar usuario={usuario} /> {/* Pasar `usuario` como prop */}
      <div
        className="container min-h-screen bg-cover bg-center flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${fondo})`,
        }}
      >
        <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-6">Información del usuario</h1>
          <div className="space-y-4">
            <p className="text-lg">Nombre de usuario: {usuario?.username}</p>
            <p className="text-lg">Correo electrónico: {usuario?.email}</p>
            {usuario?.groups.map((group) => (
              <p key={group.id} className="text-lg">Grupo: {group.name}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { UserInfo } from "../../models/user/UserInfo";
import useAdminProtection from "../../navigation/useAdminProtection";
import { UserService } from "../../services/UserService";
import { DeporteService } from "../../services/partidoyapuesta/DeporteService";
import { DeporteModel } from "../../models/partidoyapuesta/DeporteModel";
import { useNavigate } from "react-router-dom";

function HomeClient() {
  useAdminProtection();

  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UserInfo | null>(null);
  const [deportes, setDeportes] = useState<DeporteModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Cargar información del usuario
    new UserService()
      .getInfoUser()
      .then((response) => {
        localStorage.setItem("isAdminUsuario", response.is_admin_usuario.toString());
        localStorage.setItem("isAdminRecarga", response.is_admin_recarga.toString());
        localStorage.setItem("isAdminPartido", response.is_admin_partido.toString());
        localStorage.setItem("isCliente", response.is_cliente.toString());
        setUsuario(response);
      })
      .catch((error) => {
        console.log("Error: ", error);
      });

    // Cargar lista de deportes
    new DeporteService()
      .getDeportes()
      .then((response) => {
        setDeportes(response);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("Error cargando deportes:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar cliente={usuario}/>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Deportes Disponibles</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {deportes.map((deporte) => (
              <div 
                key={deporte.id}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <div className="relative h-48">
                  <img
                    src={deporte.imagen}
                    alt={deporte.nombre}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{deporte.nombre}</h3>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400 flex gap-1.5">
                      Partidos disponibles 
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                      </svg>

                    </span>
                    <button 
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                      onClick={() => navigate(`/cliente/ligas/${deporte.id}`)}
                    >
                      Entrar
                    </button>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-700 bg-opacity-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg 
                        className="w-4 h-4 text-yellow-500" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm text-gray-300">Popular</span>
                    </div>
                    <span className="text-sm text-gray-300">
                      {/* Aquí podrías mostrar el número de apuestas activas */}
                      Apuestas activas
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeClient;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { LigaPartidos } from "../../models/cliente/LigaPartidos";
import { ClienteLigaService } from "../../services/cliente/ClienteLigaService";
import { UserService } from "../../services/UserService";
import { UserInfo } from "../../models/user/UserInfo";

function LigasDeporte() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UserInfo | null>(null);
  const [ligas, setLigas] = useState<LigaPartidos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLiga, setSelectedLiga] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      loadLigas(parseInt(id));
    }
  }, [id]);

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
  }, []);

  const loadLigas = async (deporteId: number) => {
    try {
      const response = await new ClienteLigaService().getLigasWithPartidos(deporteId);
      setLigas(response);
      if (response.length > 0) {
        setSelectedLiga(response[0].id);
      }
    } catch (error) {
      console.error("Error cargando ligas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar cliente={usuario}/>
      
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar de Ligas */}
            <div className="lg:w-1/4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-bold text-white mb-4">Ligas</h2>
                <div className="space-y-2">
                  {ligas.map((liga) => (
                    <button
                      key={liga.id}
                      onClick={() => setSelectedLiga(liga.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-3
                        ${selectedLiga === liga.id 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'}`}
                    >
                      <img 
                        src={`http://localhost:8001${liga.logo}`} 
                        alt={liga.nombre} 
                        className="w-10 h-10 object-contain"
                      />
                      <span>{liga.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Lista de Partidos */}
            <div className="lg:w-3/4">
              {ligas.find(l => l.id === selectedLiga)?.partidos?.map((partido) => (
                <div 
                  key={partido.id}
                  className="bg-gray-800 rounded-lg mb-4 p-4 hover:bg-gray-750 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-gray-400 text-sm mb-2">
                        {formatDate(partido.fecha_hora)}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 items-center">
                        {/* Equipo 1 */}
                        <div className="text-center cursor-pointer" onClick={() => navigate(`/cliente/equipo/${partido.equipo1.id}`)}>
                          <img 
                            src={`http://localhost:8001${partido.equipo1.imagen}`}
                            alt={partido.equipo1.nombre}
                            className="w-12 h-12 mx-auto mb-2 object-contain"
                          />
                          <div className="text-white font-medium">
                            {partido.equipo1.nombre}
                          </div>
                        </div>

                        {/* Marcador */}
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">
                            {partido.estado === 1 ? (
                              `${partido.marcador1} - ${partido.marcador2}`
                            ) : (
                              "VS"
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {partido.estado === 0 ? "Próximamente" : 
                             partido.estado === 1 ? "En Vivo" : 
                             partido.estado === 2 ? "Finalizado" :
                             partido.estado === 3 ? "Cancelado" : ""}
                          </div>
                        </div>

                        {/* Equipo 2 */}
                        <div className="text-center cursor-pointer" onClick={() => navigate(`/cliente/equipo/${partido.equipo2.id}`)}>
                          <img 
                            src={`http://localhost:8001${partido.equipo2.imagen}`}
                            alt={partido.equipo2.nombre}
                            className="w-12 h-12 mx-auto mb-2 object-contain"
                          />
                          <div className="text-white font-medium">
                            {partido.equipo2.nombre}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Botón de apuestas */}
                    <div className="ml-4">
                      <button 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                        onClick={() => navigate(`/cliente/partido/${partido.id}`)}
                      >
                        Ver
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {
                ligas.find(l => l.id === selectedLiga)?.partidos?.length === 0 && (
                  <div className="text-white text-center text-2xl">
                    No hay partidos disponibles
                  </div>
                )
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default LigasDeporte; 
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { Equipo, Partidos } from "../../models/cliente/Equipo";
import { EquipoService } from "../../services/cliente/EquipoService";
import { UserInfo } from "../../models/user/UserInfo";
import { UserService } from "../../services/UserService";

function DetalleEquipo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<UserInfo | null>(null);
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pasados' | 'futuros'>('futuros');

  useEffect(() => {
    if (id) {
      loadEquipo(parseInt(id));
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

  const loadEquipo = async (equipoId: number) => {
    try {
      const response = await new EquipoService().getEquipoById(equipoId);
      setEquipo(response);
    } catch (error) {
      console.error("Error cargando equipo:", error);
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

  const renderPartidoCard = (partido: Partidos) => (
    <div 
      key={partido.id}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors duration-200"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={`http://localhost:8001${partido.liga.logo}`}
              alt={partido.liga.nombre}
              className="w-6 h-6 object-contain"
            />
            <span className="text-gray-400 text-sm">{partido.liga.nombre}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 items-center">
            <div className="text-center">
              <img 
                src={`http://localhost:8001${partido.equipo1.imagen}`}
                alt={partido.equipo1.nombre}
                className="w-12 h-12 mx-auto mb-2 object-contain"
              />
              <div className="text-white font-medium">
                {partido.equipo1.nombre}
              </div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {partido.estado === 1 ? (
                  `${partido.marcador1} - ${partido.marcador2}`
                ) : (
                  "VS"
                )}
              </div>
              <div className="text-sm text-gray-400">
                {formatDate(partido.fecha_hora)}
              </div>
              <div className="text-xs text-gray-500">
                {partido.estado === 0 ? "Próximamente" : 
                 partido.estado === 1 ? "En Vivo" : 
                 partido.estado === 2 ? "Finalizado" :
                 partido.estado === 3 ? "Cancelado" : ""}
              </div>
            </div>

            <div className="text-center">
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

        <div className="ml-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            onClick={() => navigate(`/cliente/partido/${partido.id}`)}
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar cliente={usuario}/>
      
      <div className="container mx-auto px-4 py-8">
        {/* Cabecera del equipo */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-6">
            <img 
              src={`http://localhost:8001${equipo?.imagen}`}
              alt={equipo?.nombre}
              className="w-32 h-32 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{equipo?.nombre}</h1>
              <div className="flex gap-4">
                <div className="text-gray-400">
                  <span className="text-sm">Partidos Jugados:</span>
                  <span className="ml-2 text-white font-medium">
                    {equipo?.partidos_pasados.length}
                  </span>
                </div>
                <div className="text-gray-400">
                  <span className="text-sm">Próximos Partidos:</span>
                  <span className="ml-2 text-white font-medium">
                    {equipo?.partidos_futuros.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'futuros' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
            }`}
            onClick={() => setActiveTab('futuros')}
          >
            Próximos Partidos
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === 'pasados' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
            }`}
            onClick={() => setActiveTab('pasados')}
          >
            Partidos Jugados
          </button>
        </div>

        {/* Lista de partidos */}
        <div className="space-y-4">
          {activeTab === 'futuros' ? (
            equipo?.partidos_futuros.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No hay próximos partidos programados
              </div>
            ) : (
              equipo?.partidos_futuros.map(renderPartidoCard)
            )
          ) : (
            equipo?.partidos_pasados.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                No hay partidos jugados
              </div>
            ) : (
              equipo?.partidos_pasados.map(renderPartidoCard)
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalleEquipo; 
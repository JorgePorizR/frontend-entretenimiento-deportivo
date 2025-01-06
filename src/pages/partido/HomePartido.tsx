import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import useAdminProtection from "../../navigation/useAdminProtection";
import { EquipoService } from "../../services/partidoyapuesta/EquipoService";
import { DeporteService } from "../../services/partidoyapuesta/DeporteService";
import { LigaService } from "../../services/partidoyapuesta/LigaService";
import { EquipoModel } from "../../models/partidoyapuesta/EquipoModel";
import { DeporteModel } from "../../models/partidoyapuesta/DeporteModel";
import { LigaModel } from "../../models/partidoyapuesta/LigaModel";
import EquipoFormModal from "../../components/partidoyapuesta/EquipoFormModal";
import DeporteFormModal from "../../components/partidoyapuesta/DeporteFormModal";
import LigaFormModal from "../../components/partidoyapuesta/LigaFormModal";
import { PartidoService } from "../../services/partidoyapuesta/PartidoService";
import { PartidoModel } from "../../models/partidoyapuesta/PartidoModel";
import PartidoFormModal from "../../components/partidoyapuesta/PartidoFromModal";
import { EventoPartidoModel } from "../../models/partidoyapuesta/EventoPartidoModel";
import { EventoPartidoService } from "../../services/partidoyapuesta/EventoPartidoService";
import EventoPartidoFormModal from "../../components/partidoyapuesta/EventoPartidoModal";
import { useNavigate } from "react-router-dom";
import PartidoMontoTotalModal from "../../components/partidoyapuesta/montoTotal/PartidoMontoTotalModal";
import ActualizarMarcadorModal from "../../components/partidoyapuesta/marcadoresEventos/ActualizarMarcadorModal";
import AgregarEventoModal from "../../components/partidoyapuesta/marcadoresEventos/AgregarEventoModal";

function HomePartido() {
  useAdminProtection();
  const navigate = useNavigate();

  // Estados para Equipos
  const [equipos, setEquipos] = useState<EquipoModel[]>([]);
  const [isLoadingEquipos, setIsLoadingEquipos] = useState(true);
  const [selectedEquipo, setSelectedEquipo] = useState<EquipoModel | null>(
    null
  );
  const [isEquipoModalOpen, setIsEquipoModalOpen] = useState(false);

  // Estados para Deportes
  const [deportes, setDeportes] = useState<DeporteModel[]>([]);
  const [isLoadingDeportes, setIsLoadingDeportes] = useState(true);
  const [selectedDeporte, setSelectedDeporte] = useState<DeporteModel | null>(
    null
  );
  const [isDeporteModalOpen, setIsDeporteModalOpen] = useState(false);

  // Estados para Ligas
  const [ligas, setLigas] = useState<LigaModel[]>([]);
  const [isLoadingLigas, setIsLoadingLigas] = useState(true);
  const [selectedLiga, setSelectedLiga] = useState<LigaModel | null>(null);
  const [isLigaModalOpen, setIsLigaModalOpen] = useState(false);

  // Estado para Partidos
  const [partidos, setPartidos] = useState<PartidoModel[]>([]);
  const [isLoadingPartidos, setIsLoadingPartidos] = useState(true);
  const [selectedPartido, setSelectedPartido] = useState<PartidoModel | null>(
    null
  );
  const [isPartidoModalOpen, setIsPartidoModalOpen] = useState(false);
  const [selectedPartidoId, setSelectedPartidoId] = useState<number | null>(
    null
  );
  const [isMontoModalOpen, setIsMontoModalOpen] = useState(false);

  // Estado para Eventos de Partido
  const [eventosPartido, setEventosPartido] = useState<EventoPartidoModel[]>(
    []
  );
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [selectedEvento, setSelectedEvento] =
    useState<EventoPartidoModel | null>(null);
  const [isEventoModalOpen, setIsEventoModalOpen] = useState(false);

  const [isActualizarMarcadorModalOpen, setIsActualizarMarcadorModalOpen] = useState(false);
  const [isAgregarEventoModalOpen, setIsAgregarEventoModalOpen] = useState(false);
  const [selectedPartidoForAction, setSelectedPartidoForAction] = useState<PartidoModel | null>(null);

  const equipoService = new EquipoService();
  const deporteService = new DeporteService();
  const ligaService = new LigaService();
  const partidoService = new PartidoService();
  const eventoPartidoService = new EventoPartidoService();

  // Obtener equipos, deportes y ligas al cargar la página
  useEffect(() => {
    loadEquipos();
    loadDeportes();
    loadLigas();
    loadPartidos();
    loadEventos();
  }, []);

  const loadEquipos = async () => {
    setIsLoadingEquipos(true);
    try {
      const equiposList = await equipoService.getEquipos();
      setEquipos(equiposList);
    } catch (error) {
      console.error("Error al cargar los equipos:", error);
    } finally {
      setIsLoadingEquipos(false);
    }
  };

  const loadDeportes = async () => {
    setIsLoadingDeportes(true);
    try {
      const deportesList = await deporteService.getDeportes();
      setDeportes(deportesList);
    } catch (error) {
      console.error("Error al cargar los deportes:", error);
    } finally {
      setIsLoadingDeportes(false);
    }
  };

  const loadLigas = async () => {
    setIsLoadingLigas(true);
    try {
      const ligasList = await ligaService.getLigas();
      setLigas(ligasList);
    } catch (error) {
      console.error("Error al cargar las ligas:", error);
    } finally {
      setIsLoadingLigas(false);
    }
  };

  const loadPartidos = async () => {
    setIsLoadingPartidos(true);
    try {
      const partidosList = await partidoService.getPartidos();
      setPartidos(partidosList);
    } catch (error) {
      console.error("Error al cargar los partidos:", error);
    } finally {
      setIsLoadingPartidos(false);
    }
  };

  const loadEventos = async () => {
    setIsLoadingEventos(true);
    try {
      const eventosList = await eventoPartidoService.getEventosPartido();
      setEventosPartido(eventosList);
    } catch (error) {
      console.error("Error al cargar los eventos:", error);
    } finally {
      setIsLoadingEventos(false);
    }
  };

  // Handlers para Equipos
  const handleCreateEquipo = () => {
    setSelectedEquipo(null);
    setIsEquipoModalOpen(true);
  };

  const handleEditEquipo = (equipo: EquipoModel) => {
    setSelectedEquipo(equipo);
    setIsEquipoModalOpen(true);
  };

  const handleDeleteEquipo = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este equipo?")) {
      try {
        await equipoService.deleteEquipo(id);
        loadEquipos();
      } catch (error) {
        console.error("Error al eliminar el equipo:", error);
      }
    }
  };

  // Handlers para Deportes
  const handleCreateDeporte = () => {
    setSelectedDeporte(null);
    setIsDeporteModalOpen(true);
  };

  const handleEditDeporte = (deporte: DeporteModel) => {
    setSelectedDeporte(deporte);
    setIsDeporteModalOpen(true);
  };

  const handleDeleteDeporte = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este deporte?")) {
      try {
        await deporteService.deleteDeporte(id);
        loadDeportes();
      } catch (error) {
        console.error("Error al eliminar el deporte:", error);
      }
    }
  };

  // Handlers para Ligas
  const handleCreateLiga = () => {
    setSelectedLiga(null);
    setIsLigaModalOpen(true);
  };

  const handleEditLiga = (liga: LigaModel) => {
    setSelectedLiga(liga);
    setIsLigaModalOpen(true);
  };

  const handleDeleteLiga = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta liga?")) {
      try {
        await ligaService.deleteLiga(id);
        loadLigas();
      } catch (error) {
        console.error("Error al eliminar la liga:", error);
      }
    }
  };

  // Handlers para Partidos
  const handleCreatePartido = () => {
    setSelectedPartido(null); // Para crear un nuevo partido
    setIsPartidoModalOpen(true);
  };

  const handleEditPartido = (partido: PartidoModel) => {
    setSelectedPartido(partido); // Para editar un partido
    setIsPartidoModalOpen(true);
  };

  const handleDeletePartido = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este partido?")) {
      try {
        await partidoService.deletePartido(id);
        loadPartidos();
      } catch (error) {
        console.error("Error al eliminar el partido:", error);
      }
    }
  };

  const handleViewMontoTotal = (id: number) => {
    setSelectedPartidoId(id);
    setIsMontoModalOpen(true);
  };

  // Handlers para los eventos
  const handleCreateEvento = () => {
    setSelectedEvento(null);
    setIsEventoModalOpen(true);
  };

  const handleEditEvento = (evento: EventoPartidoModel) => {
    setSelectedEvento(evento);
    setIsEventoModalOpen(true);
  };

  const handleDeleteEvento = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      try {
        await eventoPartidoService.deleteEventoPartido(id);
        loadEventos();
      } catch (error) {
        console.error("Error al eliminar el evento:", error);
      }
    }
  };

  const handleIniciarPartido = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas iniciar este partido?")) {
      try {
        await partidoService.iniciarPartido(id);
        loadPartidos();
      } catch (error) {
        console.error("Error al iniciar el partido:", error);
      }
    }
  };

  const handleFinalizarPartido = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas finalizar este partido?")) {
      try {
        await partidoService.finalizarPartido(id);
        loadPartidos();
      } catch (error) {
        console.error("Error al finalizar el partido:", error);
      }
    }
  };

  const handleCancelarPartido = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar este partido?")) {
      try {
        await partidoService.cancelarPartido(id);
        loadPartidos();
      } catch (error) {
        console.error("Error al cancelar el partido:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Panel de Administración de Partidos
          </h1>
          <button
            onClick={() => navigate("/admin/partidos/clientes")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 max-h-max"
          >
            Ir a Clientes
          </button>
        </div>
        {/* Sección de Equipos */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Equipos
            </h1>
            <button
              onClick={handleCreateEquipo}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Crear Equipo
            </button>
          </div>

          {isLoadingEquipos ? (
            <div className="text-center text-gray-500">Cargando equipos...</div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Imagen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {equipos.map((equipo) => (
                    <tr key={equipo.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {equipo.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={equipo.imagen}
                          alt={equipo.nombre}
                          className="w-16 h-16 object-contain rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditEquipo(equipo)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteEquipo(equipo.id!)}
                          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sección de Deportes */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Deportes
            </h1>
            <button
              onClick={handleCreateDeporte}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Crear Deporte
            </button>
          </div>

          {isLoadingDeportes ? (
            <div className="text-center text-gray-500">
              Cargando deportes...
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Imagen
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deportes.map((deporte) => (
                    <tr key={deporte.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {deporte.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={deporte.imagen}
                          alt={deporte.nombre}
                          className="w-16 h-16 object-contain rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditDeporte(deporte)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteDeporte(deporte.id!)}
                          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sección de Ligas */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Ligas
            </h1>
            <button
              onClick={handleCreateLiga}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Crear Liga
            </button>
          </div>

          {isLoadingLigas ? (
            <div className="text-center text-gray-500">Cargando ligas...</div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Logo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ligas.map((liga) => (
                    <tr key={liga.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {liga.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={liga.logo}
                          alt={liga.nombre}
                          className="w-16 h-16 object-contain rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleEditLiga(liga)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteLiga(liga.id!)}
                          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Sección de Partidos */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Partidos
            </h1>
            <button
              onClick={handleCreatePartido}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Crear Partido
            </button>
          </div>

          {isLoadingPartidos ? (
            <div className="text-center text-gray-500">
              Cargando partidos...
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Liga
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Equipo 1
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Equipo 2
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Duración
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {partidos.map((partido) => (
                    <tr key={partido.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partido.liga.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partido.equipo1.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partido.equipo2.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(partido.fecha_hora).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {partido.duracion_minutos} minutos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex flex-wrap gap-2">
                        {partido.estado === 0 && (
                          <>
                            <button
                              onClick={() => handleIniciarPartido(partido.id)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md mr-2"
                            >
                              Iniciar
                            </button>
                            <button
                              onClick={() => handleCancelarPartido(partido.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mr-2"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                        
                        {partido.estado === 1 && (
                          <>
                            <button
                              onClick={() => handleFinalizarPartido(partido.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                            >
                              Finalizar
                            </button>
                            <button
                              onClick={() => handleCancelarPartido(partido.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md mr-2"
                            >
                              Cancelar
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPartidoForAction(partido);
                                setIsActualizarMarcadorModalOpen(true);
                              }}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md mr-2"
                            >
                              Actualizar Marcador
                            </button>
                            <button
                              onClick={() => {
                                setSelectedPartidoForAction(partido);
                                setIsAgregarEventoModalOpen(true);
                              }}
                              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md mr-2"
                            >
                              Agregar Evento
                            </button>
                          </>
                        )}

                        {/* Botones existentes que se muestran siempre */}
                        <button
                          onClick={() => handleViewMontoTotal(partido.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Ver Monto Total
                        </button>
                        <button
                          onClick={() => handleEditPartido(partido)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeletePartido(partido.id!)}
                          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tabla de Eventos de Partido */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Gestión de Eventos de Partido
            </h1>
            <button
              onClick={handleCreateEvento}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Crear Evento
            </button>
          </div>

          {isLoadingEventos ? (
            <div className="text-center text-gray-500">Cargando eventos...</div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Equipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Minuto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventosPartido.map((evento) => (
                    <tr key={evento.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evento.descripcion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evento.equipo.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {evento.minuto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => handleEditEvento(evento)}
                          className="bg-yellow-500 hover:bg-yellow-400 text-white px-3 py-1 rounded-md mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteEvento(evento.id)}
                          className="bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded-md"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modales de Equipo, Deporte y Liga */}
        <EquipoFormModal
          isOpen={isEquipoModalOpen}
          onClose={() => setIsEquipoModalOpen(false)}
          equipo={selectedEquipo}
          onSubmit={(data) => {
            if (selectedEquipo) {
              equipoService
                .updateEquipo(selectedEquipo.id!, data)
                .then(loadEquipos)
                .then(() => setIsEquipoModalOpen(false));
            } else {
              equipoService
                .createEquipo(data)
                .then(loadEquipos)
                .then(() => setIsEquipoModalOpen(false));
            }
          }}
        />

        <DeporteFormModal
          isOpen={isDeporteModalOpen}
          onClose={() => setIsDeporteModalOpen(false)}
          deporte={selectedDeporte}
          onSubmit={(data) => {
            if (selectedDeporte) {
              deporteService
                .updateDeporte(selectedDeporte.id!, data)
                .then(loadDeportes)
                .then(() => setIsDeporteModalOpen(false));
            } else {
              deporteService
                .createDeporte(data)
                .then(loadDeportes)
                .then(() => setIsDeporteModalOpen(false));
            }
          }}
        />

        <LigaFormModal
          isOpen={isLigaModalOpen}
          onClose={() => setIsLigaModalOpen(false)}
          liga={selectedLiga}
          onSubmit={(data) => {
            if (selectedLiga) {
              ligaService
                .updateLiga(selectedLiga.id!, data)
                .then(loadLigas)
                .then(() => setIsLigaModalOpen(false));
            } else {
              ligaService
                .createLiga(data)
                .then(loadLigas)
                .then(() => setIsLigaModalOpen(false));
            }
          }}
        />

        <PartidoFormModal
          isOpen={isPartidoModalOpen}
          onClose={() => setIsPartidoModalOpen(false)}
          partido={selectedPartido}
          onSubmit={(data) => {
            if (selectedPartido) {
              partidoService
                .updatePartido(selectedPartido.id!, data)
                .then(loadPartidos)
                .then(() => setIsPartidoModalOpen(false));
            } else {
              partidoService
                .createPartido(data)
                .then(loadPartidos)
                .then(() => setIsPartidoModalOpen(false));
            }
          }}
        />

        <PartidoMontoTotalModal
          isOpen={isMontoModalOpen}
          onClose={() => setIsMontoModalOpen(false)}
          partidoId={selectedPartidoId}
        />

        {/* Modal de Evento de Partido */}
        <EventoPartidoFormModal
          isOpen={isEventoModalOpen}
          onClose={() => setIsEventoModalOpen(false)}
          evento={selectedEvento}
          onSubmit={(data) => {
            if (selectedEvento) {
              eventoPartidoService
                .updateEventoPartido(selectedEvento.id, data)
                .then(loadEventos)
                .then(() => setIsEventoModalOpen(false));
            } else {
              eventoPartidoService
                .createEventoPartido(data)
                .then(loadEventos)
                .then(() => setIsEventoModalOpen(false));
            }
          }}
        />

        <ActualizarMarcadorModal
          isOpen={isActualizarMarcadorModalOpen}
          onClose={() => {
            setIsActualizarMarcadorModalOpen(false);
            setSelectedPartidoForAction(null);
          }}
          partido={selectedPartidoForAction}
          onSubmit={async (marcador1: number, marcador2: number) => {
            if (selectedPartidoForAction) {
              try {
                await partidoService.actualizarMarcadoresPartido(
                  selectedPartidoForAction.id,
                  marcador1,
                  marcador2
                );
                loadPartidos();
                setIsActualizarMarcadorModalOpen(false);
                setSelectedPartidoForAction(null);
              } catch (error) {
                console.error("Error al actualizar marcadores:", error);
              }
            }
          }}
        />

        <AgregarEventoModal
          isOpen={isAgregarEventoModalOpen}
          onClose={() => {
            setIsAgregarEventoModalOpen(false);
            setSelectedPartidoForAction(null);
          }}
          partido={selectedPartidoForAction}
          onSubmit={async (descripcion: string, equipo_id: number, minuto: number) => {
            if (selectedPartidoForAction) {
              try {
                await partidoService.agregarEventoPartido(
                  selectedPartidoForAction.id,
                  descripcion,
                  equipo_id,
                  minuto
                );
                loadPartidos();
                loadEventos();
                setIsAgregarEventoModalOpen(false);
                setSelectedPartidoForAction(null);
              } catch (error) {
                console.error("Error al agregar evento:", error);
              }
            }
          }}
        />
      </div>
    </div>
  );
}

export default HomePartido;
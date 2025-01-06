import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { PartidoEventos, Evento } from "../../models/cliente/PartidoEventos";
import { PartidoMultiplicadores } from "../../models/cliente/PartidoMultiplicadores";
import { PartidoService } from "../../services/cliente/PartidoService";
import { UserService } from "../../services/UserService";
import { UserInfo } from "../../models/user/UserInfo";
import { BilleteraService } from "../../services/cliente/BilleteraService";
import { BilleteraCliente } from "../../models/cliente/BilleteraCliente";
import { ApuestaClienteBody } from "../../models/cliente/ApuestaClienteBody";
import { ApuestaClienteService } from "../../services/cliente/ApuestaClienteService";
import socket from "../../hooks/socket";

function DetallePartido() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<UserInfo | null>(null);
  const [billetera, setBilletera] = useState<BilleteraCliente | null>(null);
  const [partido, setPartido] = useState<PartidoEventos | null>(null);
  const [multiplicadores, setMultiplicadores] = useState<PartidoMultiplicadores | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [montoApuesta, setMontoApuesta] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [apuestaSeleccionada, setApuestaSeleccionada] = useState<{
    tipo: number;
    equipo_id?: number;
    multiplicador: number;
    equipoNombre?: string;
    partido_id?: number;
  } | null>(null);

  useEffect(() => {
    if (id) {
      loadPartido(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    // Escuchar mensajes del WebSocket
    socket.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        console.log('Mensaje del servidor:', data.message);
        if (id) {
          loadPartido(parseInt(id));
        }
      }
    };

    // Limpiar el event listener al desmontar el componente
    return () => {
      socket.onmessage = null;
    };
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
  
        // Cargar billetera después de establecer el usuario
        return new BilleteraService().getBilleteraByCliente(response.id);
      })
      .then((billeteraResponse) => {
        setBilletera(billeteraResponse);
      })
      .catch((error) => {
        console.error("Error al obtener la información del usuario o la billetera:", error);
      });
  }, []);
  

  const loadPartido = async (partidoId: number) => {
    try {
      const [partidoData, multiplicadoresData] = await Promise.all([
        new PartidoService().getPartidoById(partidoId),
        new PartidoService().getMultiplicadoresPartido(partidoId)
      ]);
      setPartido(partidoData);
      setMultiplicadores(multiplicadoresData);
    } catch (error) {
      console.error("Error cargando datos del partido:", error);
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

  const renderEventos = (eventos: Evento[]) => {
    return eventos.sort((a, b) => b.minuto - a.minuto).map((evento) => (
      <div 
        key={evento.id}
        className="flex items-center gap-4 p-3 bg-gray-800 rounded-lg"
      >
        <div className="w-16 text-center">
          <span className="text-yellow-500 font-bold">{evento.minuto}'</span>
        </div>
        <div className="flex items-center gap-3 flex-1">
          <img 
            src={`http://localhost:8001${evento.equipo.imagen}`}
            alt={evento.equipo.nombre}
            className="w-6 h-6 object-contain"
          />
          <span className="text-white">{evento.descripcion}</span>
        </div>
      </div>
    ));
  };

  const puedeApostar = (): boolean => {
    if (!partido) return false;
  
    // Si el estado del partido es 2 (Finalizado) o 3 (Cancelado), no se puede apostar
    if (partido.estado === 1 || partido.estado === 2 || partido.estado === 3) return false;
  
    // Si la fecha del partido es anterior a la fecha actual, no se puede apostar
    const fechaPartido = new Date(partido.fecha_hora);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ajustar la hora a medianoche para comparación de fechas
    if (fechaPartido < hoy) return false;
  
    // Si ninguna condición se cumple, se puede apostar
    return true;
  };

  const handleAbrirModal = (tipo: number, multiplicador: number, equipo_id?: number, equipoNombre?: string, partido_id?: number) => {
    setApuestaSeleccionada({
      tipo,
      equipo_id,
      multiplicador,
      equipoNombre,
      partido_id
    });
    setMontoApuesta('');
    setError('');
    setShowModal(true);
  };

  const handleCrearApuesta = async () => {
    if (!usuario || !apuestaSeleccionada || !montoApuesta || !billetera) {
      return;
    }

    const monto = parseFloat(montoApuesta);
    if (isNaN(monto) || monto <= 0) {
      setError('Por favor, ingrese un monto válido');
      return;
    }

    if (monto > billetera.saldo) {
      setError('Saldo insuficiente');
      return;
    }

    const apuestaBody: ApuestaClienteBody = {
      usuario_id: usuario.id,
      partido_id: apuestaSeleccionada.partido_id || 0,
      tipo_apuesta: apuestaSeleccionada.tipo,
      monto: monto,
      equipo_id: apuestaSeleccionada.equipo_id || 0,
      multiplicador: apuestaSeleccionada.multiplicador
    };

    console.log('Apuesta:', apuestaBody);

    try {
      await new ApuestaClienteService().crearApuesta(apuestaBody);
      setShowModal(false);
      // Recargar billetera
      if (usuario) {
        const nuevaBilletera = await new BilleteraService().getBilleteraByCliente(usuario.id);
        setBilletera(nuevaBilletera);
      }
    } catch (error) {
      console.error('Error al crear la apuesta:', error);
      setError('Error al crear la apuesta');
    }
  };

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
      <NavBar cliente={usuario} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Cabecera del partido */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <img 
              src={`http://localhost:8001${partido?.liga.logo}`}
              alt={partido?.liga.nombre}
              className="w-8 h-8 object-contain"
            />
            <span className="text-white font-medium">{partido?.liga.nombre}</span>
          </div>

          <div className="grid grid-cols-3 gap-8 items-center">
            <div className="text-center">
              <img 
                src={`http://localhost:8001${partido?.equipo1.imagen}`}
                alt={partido?.equipo1.nombre}
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <div className="text-xl font-bold text-white mb-2">
                {partido?.equipo1.nombre}
              </div>
              {multiplicadores && puedeApostar() && (
                <button 
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    puedeApostar()
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => handleAbrirModal(0, multiplicadores.multiplicadores.equipo1, partido?.equipo1.id, partido?.equipo1.nombre, partido?.id)}
                  disabled={!puedeApostar()}
                >
                  <div className="text-sm mb-1">Gana {partido?.equipo1.nombre}</div>
                  <div className="text-xl font-bold">{multiplicadores.multiplicadores.equipo1}x</div>
                </button>
              )}
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-4">
                {partido?.estado === 1 || partido?.estado === 2 ? (
                  `${partido.marcador1} - ${partido.marcador2}`
                ) : (
                  "VS"
                )}
              </div>
              <div className="text-gray-400 mb-2">
                {formatDate(partido!.fecha_hora)}
              </div>
              <div className="text-sm font-medium mb-4">
                {partido?.estado === 0 ? 
                  <p className="text-yellow-500">Próximamente</p> : 
                  partido?.estado === 1 ? 
                  <p className="text-green-500">En Vivo</p> : 
                  partido?.estado === 2 ? 
                  <p className="text-blue-500">Finalizado</p> :
                  partido?.estado === 3 ? 
                  <p className="text-red-500">Cancelado</p> : 
                  <p className="text-gray-500">Desconocido</p>}
              </div>
              {multiplicadores && puedeApostar() && (
                <button 
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    puedeApostar()
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => handleAbrirModal(1, multiplicadores.multiplicadores.Empate, partido?.equipo1.id, "", partido?.id)}
                  disabled={!puedeApostar()}
                >
                  <div className="text-sm mb-1">Empate</div>
                  <div className="text-xl font-bold">{multiplicadores.multiplicadores.Empate}x</div>
                </button>
              )}
            </div>

            <div className="text-center">
              <img 
                src={`http://localhost:8001${partido?.equipo2.imagen}`}
                alt={partido?.equipo2.nombre}
                className="w-24 h-24 mx-auto mb-4 object-contain"
              />
              <div className="text-xl font-bold text-white mb-2">
                {partido?.equipo2.nombre}
              </div>
              {multiplicadores && puedeApostar() && (
                <button 
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-colors duration-200 ${
                    puedeApostar()
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-600 cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => handleAbrirModal(0, multiplicadores.multiplicadores.equipo2, partido?.equipo2.id, partido?.equipo2.nombre, partido?.id)}
                  disabled={!puedeApostar()}
                >
                  <div className="text-sm mb-1">Gana {partido?.equipo2.nombre}</div>
                  <div className="text-xl font-bold">{multiplicadores.multiplicadores.equipo2}x</div>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Eventos del partido */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Eventos del Partido
          </h2>
          <hr className="border-gray-700 my-4" />
          <div className="flex items-center gap-4 p-3 bg-gray-700 rounded-lg">
            <div className="w-16 text-center">
              <span className="text-white font-bold">Minuto</span>
            </div>
            <div className="flex items-center gap-3 flex-1 font-bold">
              <span className="text-white">Evento</span>
            </div>
          </div>
          <div className="space-y-3">
            {partido?.eventos && partido.eventos.length > 0 ? (
              renderEventos(partido.eventos)
            ) : (
              <div className="text-center text-gray-400 py-4">
                No hay eventos registrados
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">
              Realizar Apuesta
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-300 mb-2">
                Tipo: {apuestaSeleccionada?.tipo === 0 
                  ? `Gana ${apuestaSeleccionada.equipoNombre}` 
                  : 'Empate'}
              </p>
              <p className="text-gray-300 mb-2">
                Multiplicador: {apuestaSeleccionada?.multiplicador}x
              </p>
              <p className="text-gray-300 mb-4">
                Saldo disponible: ${billetera?.saldo.toFixed(2)}
              </p>
              
              <label className="block text-gray-300 mb-2">
                Monto a apostar:
              </label>
              <input
                type="number"
                value={montoApuesta}
                onChange={(e) => setMontoApuesta(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el monto"
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
              
              {montoApuesta && !isNaN(parseFloat(montoApuesta)) && (
                <p className="text-green-500 mt-2">
                  Ganancia potencial: ${(parseFloat(montoApuesta) * apuestaSeleccionada!.multiplicador).toFixed(2)}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                onClick={handleCrearApuesta}
              >
                Confirmar Apuesta
              </button>
              <button
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetallePartido; 
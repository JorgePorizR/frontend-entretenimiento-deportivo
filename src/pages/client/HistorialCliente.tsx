import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { ApuestaModel } from "../../models/partidoyapuesta/ApuestaModel";
import { BilleteraCliente } from "../../models/cliente/BilleteraCliente";
import { MovimientoCliente } from "../../models/cliente/MovimientoCliente";
import { ApuestaClienteService } from "../../services/cliente/ApuestaClienteService";
import { BilleteraService } from "../../services/cliente/BilleteraService";

function HistorialCliente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apuestas, setApuestas] = useState<ApuestaModel[]>([]);
  const [billetera, setBilletera] = useState<BilleteraCliente | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoCliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"apuestas" | "movimientos">(
    "apuestas"
  );

  useEffect(() => {
    if (id) {
      loadData(parseInt(id));
    }
  }, [id]);

  const loadData = async (userId: number) => {
    try {
      const [apuestasData, billeteraData, movimientosData] = await Promise.all([
        new ApuestaClienteService().getHistorialApuestaCliente(userId),
        new BilleteraService().getBilleteraByCliente(userId),
        new BilleteraService().getMovimientosByCliente(userId),
      ]);
      setApuestas(apuestasData);
      setBilletera(billeteraData);
      setMovimientos(movimientosData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoColor = (estado: number) => {
    switch (estado) {
      case 0:
        return "text-yellow-500"; // Pendiente
      case 1:
        return "text-green-500"; // Ganadora
      case 2:
        return "text-red-500"; // Perdedora
      case 3:
        return "text-gray-500"; // Cancelada
      default:
        return "text-white";
    }
  };

  const getTipoApuesta = (tipo: number, equipo?: string) => {
    return tipo === 0 ? `Gana ${equipo}` : "Empate";
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEstadoTexto = (estado: number) => {
    switch (estado) {
      case 0:
        return "Pendiente";
      case 1:
        return "Ganadora";
      case 2:
        return "Perdedora";
      case 3:
        return "Cancelada";
      default:
        return "Desconocido";
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
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        {/* Saldo de la Billetera */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Mi Billetera
              </h2>
              <p className="text-gray-400">Usuario: {billetera?.username}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Saldo Actual</p>
              <p className="text-3xl font-bold text-green-500">
                ${billetera?.saldo.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === "apuestas"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-750"
            }`}
            onClick={() => setActiveTab("apuestas")}
          >
            Historial de Apuestas
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${
              activeTab === "movimientos"
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-750"
            }`}
            onClick={() => setActiveTab("movimientos")}
          >
            Movimientos
          </button>
        </div>

        {activeTab === "apuestas" ? (
          <div className="space-y-4">
            {apuestas.map((apuesta) => (
              <div
                key={apuesta.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors duration-200"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={apuesta.partido.liga.logo}
                        alt={apuesta.partido.liga.nombre}
                        className="w-8 h-8 object-contain"
                      />
                      <span className="text-gray-400 text-sm">
                        {apuesta.partido.liga.nombre}
                      </span>
                    </div>
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        navigate(`/cliente/partido/${apuesta.partido.id}`)
                      }
                    >
                      <div className="text-white font-medium">
                        {apuesta.partido.equipo1.nombre} vs{" "}
                        {apuesta.partido.equipo2.nombre}
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatDate(apuesta.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-bold ${getEstadoColor(apuesta.estado)}`}
                    >
                      {getEstadoTexto(apuesta.estado)}
                    </div>
                    <div className="text-white font-medium">
                      ${parseFloat(apuesta.monto).toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {getTipoApuesta(
                        apuesta.tipo_apuesta,
                        apuesta.equipo?.nombre
                      )}
                      <span className="text-yellow-500 ml-2">
                        {parseFloat(apuesta.multiplicador).toFixed(2)}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {movimientos.map((movimiento) => (
              <div key={movimiento.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-white font-medium">
                      {movimiento.descripcion}
                    </div>
                    <div className="text-sm text-gray-400">
                      <a href={movimiento.comprobante} className="flex gap-1 underline hover:text-blue-500">
                        Comprobante{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="size-5"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div
                    className={`text-xl font-bold ${
                      movimiento.tipo === 1 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {movimiento.tipo === 1 ? "+" : "-"}$
                    {movimiento.monto.toFixed(2)}
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

export default HistorialCliente;

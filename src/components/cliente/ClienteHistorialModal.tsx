import { useEffect, useState } from "react";
import { ApuestaModel } from "../../models/partidoyapuesta/ApuestaModel";
import { ClienteService } from "../../services/partidoyapuesta/ClienteService";

interface ClienteHistorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: number | null;
}

const ClienteHistorialModal = ({ isOpen, onClose, clienteId }: ClienteHistorialModalProps) => {
  const [historial, setHistorial] = useState<ApuestaModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const clienteService = new ClienteService();

  useEffect(() => {
    if (clienteId && isOpen) {
      setHistorial([]);
      loadHistorial();
    }
  }, [clienteId, isOpen]);

  const loadHistorial = async () => {
    setIsLoading(true);
    try {
      const data = await clienteService.getHistorialCliente(clienteId!);
      setHistorial(data);
    } catch (error) {
      console.error("Error al cargar el historial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4">Historial de Apuestas</h2>
        
        {isLoading ? (
          <div className="text-center text-gray-500">Cargando historial...</div>
        ) : historial.length === 0 ? (
          <div className="text-center text-gray-500">No hay apuestas registradas.</div>
        ) : (
          <div className="overflow-auto max-h-96">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Multiplicador</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {historial.map((apuesta) => (
                  <tr key={apuesta.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {apuesta.partido.equipo1.nombre} vs {apuesta.partido.equipo2.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {apuesta.equipo.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ${apuesta.monto}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {apuesta.multiplicador}x
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(apuesta.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteHistorialModal;

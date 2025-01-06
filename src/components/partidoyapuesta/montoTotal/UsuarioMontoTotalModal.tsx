import { useEffect, useState } from "react";
import { ApuestaService } from "../../../services/partidoyapuesta/ApuestaService";
import { MontoTotalUsuario } from "../../../models/partidoyapuesta/montoTotal/MontoTotalUsuario";

interface ClienteMontoTotalModalProps {
  isOpen: boolean;
  onClose: () => void;
  clienteId: number | null;
}

const UsuarioMontoTotalModal = ({ isOpen, onClose, clienteId }: ClienteMontoTotalModalProps) => {
  const [montoTotal, setMontoTotal] = useState<MontoTotalUsuario | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const apuestaService = new ApuestaService();

  useEffect(() => {
    if (clienteId && isOpen) {
      setMontoTotal(null);
      loadMontoTotal();
    }
  }, [clienteId, isOpen]);

  const loadMontoTotal = async () => {
    setIsLoading(true);
    try {
      const data = await apuestaService.getMontoTotalUsuario(clienteId!);
      setMontoTotal(data);
    } catch (error) {
      console.error("Error al cargar el monto total del cliente:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Monto Total del Cliente</h2>

        {isLoading ? (
          <div className="text-center text-gray-500">Cargando monto total...</div>
        ) : montoTotal ? (
          <div className="space-y-4">
            <div className="text-lg">
              <span className="font-semibold">Total Ganado:</span> ${montoTotal.total_ganado.toFixed(2)}
            </div>
            <div className="text-lg">
              <span className="font-semibold">Total Perdido:</span> ${montoTotal.total_perdido.toFixed(2)}
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">No hay datos disponibles.</div>
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

export default UsuarioMontoTotalModal;

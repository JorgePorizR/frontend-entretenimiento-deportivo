import { useEffect, useState } from "react";
import { UserModel } from "../../models/user/UserModel";
import NavBar from "../../components/NavBar";
import useAdminProtection from "../../navigation/useAdminProtection";
import { ClienteService } from "../../services/partidoyapuesta/ClienteService";
import ClienteHistorialModal from "../../components/cliente/ClienteHistorialModal";
import UsuarioMontoTotalModal from "../../components/partidoyapuesta/montoTotal/UsuarioMontoTotalModal";

function ClientPartido() {
  useAdminProtection();

  const [clientes, setClientes] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const clienteService = new ClienteService();

  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [isHistorialModalOpen, setIsHistorialModalOpen] = useState(false);
  const [isMontoModalOpen, setIsMontoModalOpen] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    setIsLoading(true);
    try {
      const clientesList = await clienteService.getClientList();
      setClientes(clientesList);
    } catch (error) {
      console.error("Error al cargar los clientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHistory = (id: number) => {
    setSelectedClienteId(id);
    setIsHistorialModalOpen(true);
  };

  const handleViewMontoTotal = (id: number) => {
    setSelectedClienteId(id);
    setIsMontoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Clientes</h1>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">Cargando clientes...</div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.first_name} {cliente.last_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleViewHistory(cliente.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      >
                        Historial
                      </button>
                      <button
                        onClick={() => handleViewMontoTotal(cliente.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        Ver Monto Total
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ClienteHistorialModal
        isOpen={isHistorialModalOpen}
        onClose={() => setIsHistorialModalOpen(false)}
        clienteId={selectedClienteId}
      />

      <UsuarioMontoTotalModal
        isOpen={isMontoModalOpen}
        onClose={() => setIsMontoModalOpen(false)}
        clienteId={selectedClienteId}
      />
    </div>
  );
}

export default ClientPartido;

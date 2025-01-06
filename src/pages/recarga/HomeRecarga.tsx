import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import { RecargaService } from "../../services/recarga/RecargaService";
import { BilleteraList } from "../../models/billetera/BilleteraList";
import useAdminProtection from "../../navigation/useAdminProtection";
import RecargaFormModal from "../../components/recarga/RecargaFormModal";

function HomeRecarga() {
  useAdminProtection();
  const [billeteras, setBilleteras] = useState<BilleteraList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<{ userId: number; username: string } | null>(null);

  const recargaService = new RecargaService();

  // Función para obtener todas las billeteras
  const fetchBilleteras = () => {
    setIsLoading(true);
    recargaService
      .getBilleteras()
      .then((data) => {
        setBilleteras(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching billeteras:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBilleteras();
  }, []);

  // Función para buscar billeteras por texto
  const handleSearch = () => {
    if (search.trim() === "") {
      fetchBilleteras();
    } else {
      setIsLoading(true);
      recargaService
        .searchBilletera(search)
        .then((data) => {
          setBilleteras(data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error searching billeteras:", error);
          setIsLoading(false);
        });
    }
  };

  const openRecargaModal = (userId: number, username: string) => {
    setSelectedUser({ userId, username });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Lista de Billeteras</h1>

        <div className="flex mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-r-lg"
          >
            Buscar
          </button>
        </div>

        {isLoading ? (
          <div className="text-center text-gray-500">Cargando...</div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {billeteras.map((billetera) => (
                  <tr key={billetera.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{billetera.id}</td>
                    <td className="px-6 py-4 text-sm">{billetera.firstName} {billetera.lastName}</td>
                    <td className="px-6 py-4 text-sm">{billetera.username}</td>
                    <td className="px-6 py-4 text-sm">${billetera.saldo.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => openRecargaModal(billetera.userId, billetera.username)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                      >
                        Recargar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <RecargaFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userId={selectedUser.userId}
          username={selectedUser.username}
          onRecargaSuccess={fetchBilleteras}
        />
      )}
    </div>
  );
}

export default HomeRecarga;

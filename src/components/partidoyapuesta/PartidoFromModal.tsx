import { useState, useEffect } from "react";
import { PartidoBody } from "../../models/partidoyapuesta/PartidoBody";
import { EquipoModel } from "../../models/partidoyapuesta/EquipoModel";
import { LigaModel } from "../../models/partidoyapuesta/LigaModel";
import { EquipoService } from "../../services/partidoyapuesta/EquipoService";
import { LigaService } from "../../services/partidoyapuesta/LigaService";
import { PartidoModel } from "../../models/partidoyapuesta/PartidoModel";

interface PartidoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PartidoBody) => void;
  partido: PartidoModel | null;
}

const PartidoFormModal = ({ isOpen, onClose, onSubmit, partido }: PartidoFormModalProps) => {
  const [equipo1Id, setEquipo1Id] = useState<number | null>(partido ? partido.equipo1.id : null);
  const [equipo2Id, setEquipo2Id] = useState<number | null>(partido ? partido.equipo2.id : null);
  const [ligaId, setLigaId] = useState<number | null>(partido ? partido.liga.id : null);
  const [fechaHora, setFechaHora] = useState<string>(
    partido 
      ? new Date(partido.fecha_hora).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16)
  );
  const [duracionMinutos, setDuracionMinutos] = useState<number>(partido ? partido.duracion_minutos : 0);

  // Cargar los equipos y ligas
  const [equipos, setEquipos] = useState<EquipoModel[]>([]);
  const [ligas, setLigas] = useState<LigaModel[]>([]);
  const [isLoadingEquipos, setIsLoadingEquipos] = useState(true);
  const [isLoadingLigas, setIsLoadingLigas] = useState(true);

  const equipoService = new EquipoService();
  const ligaService = new LigaService();

  useEffect(() => {
    loadEquipos();
    loadLigas();
  }, []);

  useEffect(() => {
    if (partido) {
      setEquipo1Id(partido.equipo1.id);
      setEquipo2Id(partido.equipo2.id);
      setLigaId(partido.liga.id);
      setFechaHora(new Date(partido.fecha_hora).toISOString().slice(0, 16));
      setDuracionMinutos(partido.duracion_minutos);
    } else {
      setEquipo1Id(null);
      setEquipo2Id(null);
      setLigaId(null);
      setFechaHora(new Date().toISOString().slice(0, 16));
      setDuracionMinutos(0);
    }
  }, [partido]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: PartidoBody = {
      id: partido?.id || 0,
      equipo1_id: equipo1Id!,
      equipo2_id: equipo2Id!,
      liga_id: ligaId!,
      fecha_hora: new Date(fechaHora),
      duracion_minutos: duracionMinutos,
    };
    onSubmit(formData);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{partido ? "Editar Partido" : "Crear Partido"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Seleccionar equipo1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Equipo 1</label>
              <select
                value={equipo1Id || ""}
                onChange={(e) => setEquipo1Id(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un Equipo</option>
                {!isLoadingEquipos &&
                  equipos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                    </option>
                  ))}
              </select>
            </div>

            {/* Seleccionar equipo2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Equipo 2</label>
              <select
                value={equipo2Id || ""}
                onChange={(e) => setEquipo2Id(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un Equipo</option>
                {!isLoadingEquipos &&
                  equipos.map((equipo) => (
                    <option key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                    </option>
                  ))}
              </select>
            </div>

            {/* Seleccionar liga */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Liga</label>
              <select
                value={ligaId || ""}
                onChange={(e) => setLigaId(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona una Liga</option>
                {!isLoadingLigas &&
                  ligas.map((liga) => (
                    <option key={liga.id} value={liga.id}>
                      {liga.nombre}
                    </option>
                  ))}
              </select>
            </div>

            {/* Fecha y hora */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha y Hora</label>
              <input
                type="datetime-local"
                value={fechaHora}
                onChange={(e) => setFechaHora(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Duración (minutos)</label>
              <input
                type="number"
                value={duracionMinutos}
                onChange={(e) => setDuracionMinutos(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
            >
              {partido ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartidoFormModal;

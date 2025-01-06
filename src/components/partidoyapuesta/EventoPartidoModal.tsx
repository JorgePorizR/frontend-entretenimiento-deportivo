import { useState, useEffect } from "react";
import { EventoPartidoModel } from "../../models/partidoyapuesta/EventoPartidoModel";
import { EquipoModel } from "../../models/partidoyapuesta/EquipoModel";
import { PartidoModel } from "../../models/partidoyapuesta/PartidoModel";
import { EquipoService } from "../../services/partidoyapuesta/EquipoService";
import { PartidoService } from "../../services/partidoyapuesta/PartidoService";
import { EventoPartidoBody } from "../../models/partidoyapuesta/EventoPartidoBody";

interface EventoPartidoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EventoPartidoBody) => void;
  evento: EventoPartidoModel | null;
}

const EventoPartidoFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  evento,
}: EventoPartidoFormModalProps) => {
  const [descripcion, setDescripcion] = useState<string>(evento ? evento.descripcion : "");
  const [minuto, setMinuto] = useState<number>(evento ? evento.minuto : 0);
  const [equipoId, setEquipoId] = useState<number | null>(evento ? evento.equipo.id : null);
  const [partidoId, setPartidoId] = useState<number | null>(evento ? evento.partido.id : null);

  const [equipos, setEquipos] = useState<EquipoModel[]>([]);
  const [partidos, setPartidos] = useState<PartidoModel[]>([]);
  const [isLoadingEquipos, setIsLoadingEquipos] = useState(true);
  const [isLoadingPartidos, setIsLoadingPartidos] = useState(true);

  const equipoService = new EquipoService();
  const partidoService = new PartidoService();

  useEffect(() => {
    loadEquipos();
    loadPartidos();
  }, []);

  useEffect(() => {
    if (evento) {
      setDescripcion(evento.descripcion);
      setMinuto(evento.minuto);
      setEquipoId(evento.equipo.id);
      setPartidoId(evento.partido.id);
    } else {
      setDescripcion("");
      setMinuto(0);
      setEquipoId(null);
      setPartidoId(null);
    }
  }, [evento]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: EventoPartidoBody = {
      id: evento?.id || 0,
      partido_id: partidoId!,
      descripcion,
      equipo_id: equipoId!,
      minuto,
    };
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{evento ? "Editar Evento" : "Crear Evento"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Minuto */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Minuto</label>
              <input
                type="number"
                value={minuto}
                onChange={(e) => setMinuto(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {/* Seleccionar equipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Equipo</label>
              <select
                value={equipoId || ""}
                onChange={(e) => setEquipoId(Number(e.target.value))}
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

            {/* Seleccionar partido */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Partido</label>
              <select
                value={partidoId || ""}
                onChange={(e) => setPartidoId(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un Partido</option>
                {!isLoadingPartidos &&
                  partidos.map((partido) => (
                    <option key={partido.id} value={partido.id}>
                      {partido.equipo1.nombre} vs {partido.equipo2.nombre}
                    </option>
                  ))}
              </select>
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
              {evento ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventoPartidoFormModal;

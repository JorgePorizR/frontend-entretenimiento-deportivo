import { useState } from 'react';
import { PartidoModel } from '../../../models/partidoyapuesta/PartidoModel';

interface AgregarEventoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (descripcion: string, equipoId: number, minuto: number) => void;
  partido: PartidoModel | null;
}

function AgregarEventoModal({ isOpen, onClose, onSubmit, partido }: AgregarEventoModalProps) {
  const [descripcion, setDescripcion] = useState('');
  const [equipoId, setEquipoId] = useState<string>('');
  const [minuto, setMinuto] = useState<string>('');

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-bold mb-4">Agregar Evento</h3>
          {partido && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                {partido.equipo1.nombre} vs {partido.equipo2.nombre}
              </p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Equipo
              </label>
              <select
                value={equipoId}
                onChange={(e) => setEquipoId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Selecciona un equipo</option>
                {partido && (
                  <>
                    <option value={partido.equipo1.id.toString()}>
                      {partido.equipo1.nombre}
                    </option>
                    <option value={partido.equipo2.id.toString()}>
                      {partido.equipo2.nombre}
                    </option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minuto
              </label>
              <input
                type="number"
                min="0"
                value={minuto}
                onChange={(e) => setMinuto(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onSubmit(descripcion, parseInt(equipoId), parseInt(minuto));
                setDescripcion('');
                setEquipoId('');
                setMinuto('');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={!descripcion || !equipoId || !minuto}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default AgregarEventoModal; 
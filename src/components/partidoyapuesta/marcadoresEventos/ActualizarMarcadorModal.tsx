import { useState, useEffect } from 'react';
import { PartidoModel } from '../../../models/partidoyapuesta/PartidoModel';

interface ActualizarMarcadorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (marcador1: number, marcador2: number) => void;
  partido: PartidoModel | null;
}

function ActualizarMarcadorModal({ isOpen, onClose, onSubmit, partido }: ActualizarMarcadorModalProps) {
  const [marcador1, setMarcador1] = useState<string>('0');
  const [marcador2, setMarcador2] = useState<string>('0');

  useEffect(() => {
    if (partido) {
      setMarcador1(partido.marcador1?.toString() || '0');
      setMarcador2(partido.marcador2?.toString() || '0');
    }
  }, [partido]);

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-bold mb-4">Actualizar Marcador</h3>
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
                Marcador {partido?.equipo1.nombre}
              </label>
              <input
                type="number"
                min="0"
                value={marcador1}
                onChange={(e) => setMarcador1(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marcador {partido?.equipo2.nombre}
              </label>
              <input
                type="number"
                min="0"
                value={marcador2}
                onChange={(e) => setMarcador2(e.target.value)}
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
                onSubmit(parseInt(marcador1), parseInt(marcador2));
                setMarcador1('0');
                setMarcador2('0');
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ActualizarMarcadorModal; 
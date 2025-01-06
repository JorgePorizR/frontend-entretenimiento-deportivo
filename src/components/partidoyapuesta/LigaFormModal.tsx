import { useState, useEffect } from "react";
import { LigaModel } from "../../models/partidoyapuesta/LigaModel";
import { DeporteModel } from "../../models/partidoyapuesta/DeporteModel";
import { DeporteService } from "../../services/partidoyapuesta/DeporteService";

interface LigaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  liga: LigaModel | null;
}

const LigaFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  liga,
}: LigaFormModalProps) => {
  const [nombre, setNombre] = useState<string>(liga ? liga.nombre : "");
  const [deporteId, setDeporteId] = useState<number | null>(
    liga ? liga.deporte.id : null
  );
  const [imagen, setImagen] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [deportes, setDeportes] = useState<DeporteModel[]>([]);
  const [isLoadingDeportes, setIsLoadingDeportes] = useState(true);

  const deporteService = new DeporteService();

  // Cargar deportes al abrir el modal
  useEffect(() => {
    loadDeportes();
  }, []);

  useEffect(() => {
    if (liga) {
      setNombre(liga.nombre);
      setDeporteId(liga.deporte.id);
      setImagen(null); // Reset imagen cuando estamos editando
      setPreview(null); // Mostrar la imagen actual si existe
    } else {
      setNombre("");
      setDeporteId(null);
      setImagen(null);
      setPreview(null);
    }
  }, [liga]);

  const loadDeportes = async () => {
    setIsLoadingDeportes(true);
    try {
      const deportesList = await deporteService.getDeportes();
      setDeportes(deportesList);
    } catch (error) {
      console.error("Error al cargar los deportes:", error);
    } finally {
      setIsLoadingDeportes(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setImagen(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    if (deporteId) formData.append("deporte_id", deporteId.toString());
    if (imagen) formData.append("logo", imagen);
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {liga ? "Editar Liga" : "Crear Liga"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Deporte
              </label>
              <select
                value={deporteId || ""}
                onChange={(e) => setDeporteId(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecciona un Deporte</option>
                {!isLoadingDeportes &&
                  deportes.map((deporte) => (
                    <option key={deporte.id} value={deporte.id}>
                      {deporte.nombre}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Imagen (Logo)
              </label>
              {/* Input para subir archivo */}
              <div className="flex items-center gap-4">
                <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                  Seleccionar Archivo
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
                {imagen && (
                  <span className="text-gray-600 text-sm">{imagen.name}</span>
                )}
              </div>

              {/* Si existe una imagen antigua, la mostramos */}
              {liga && !imagen && liga.logo && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-2">Imagen actual:</p>
                  <img
                    src={liga.logo}
                    alt="Logo de la liga"
                    className="w-32 h-32 object-contain rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Previsualización de la nueva imagen si se ha seleccionado */}
              {preview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">
                    Previsualización:
                  </p>
                  <img
                    src={preview}
                    alt="Previsualización de la nueva imagen"
                    className="w-32 h-32 object-contain rounded-lg shadow-md"
                  />
                </div>
              )}
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
              {liga ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LigaFormModal;

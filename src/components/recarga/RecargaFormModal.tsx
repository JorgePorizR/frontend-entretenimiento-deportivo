import { useState } from "react";
import { RecargaService } from "../../services/recarga/RecargaService";

interface RecargaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  username: string;
  onRecargaSuccess: () => void;
}

function RecargaFormModal({
  isOpen,
  onClose,
  userId,
  username,
  onRecargaSuccess,
}: RecargaFormModalProps) {
  const [monto, setMonto] = useState<number>(0);
  const [descripcion, setDescripcion] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const recargaService = new RecargaService();

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      alert("Por favor, llena todos los campos");
      return;
    }
  
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    console.log("Datos enviados:", {
      userId,
      monto,
      descripcion,
      file
    });

    setIsLoading(true);
    try {
      await recargaService.recargaMovimiento(userId, monto, descripcion, file);
      alert("Recarga realizada con éxito");
      onRecargaSuccess();
      handleClose();
    } catch (error) {
      console.error("Error en la recarga:", error);
      alert("Error al realizar la recarga");
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar el cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);

    // Crear una URL de previsualización si es una imagen
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  // Cerrar el modal y limpiar el estado del archivo y previsualización
  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setMonto(0);
    setDescripcion("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          Recargar Billetera - {username}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Monto
            </label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={4} // Ajusta el número de filas para controlar la altura inicial
              required
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Subir Comprobante
            </label>
            <div className="flex items-center space-x-4">
              <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                Seleccionar Archivo
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  required
                />
              </label>
              {file && (
                <span className="text-gray-600 text-sm">{file.name}</span>
              )}
            </div>

            {/* Previsualización de la imagen */}
            {preview && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Previsualización:</p>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Procesando..." : "Recargar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RecargaFormModal;

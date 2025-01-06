import apiClient2 from "./interceptorPartidoApuesta"; // Cambia esto según el archivo que utilices para la configuración de axios
import { LigaModel } from "../../models/partidoyapuesta/LigaModel";

export class LigaService {
  // Obtener la lista de todas las ligas
  getLigas(): Promise<LigaModel[]> {
    return new Promise<LigaModel[]>((resolve, reject) => {
      apiClient2
        .get("/ligas/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener las ligas:", error);
          reject(error);
        });
    });
  }

  // Obtener una liga por su ID
  getLiga(id: number): Promise<LigaModel> {
    return new Promise<LigaModel>((resolve, reject) => {
      apiClient2
        .get(`/ligas/${id}/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error al obtener la liga con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  // Crear una nueva liga
  createLiga(data: FormData): Promise<LigaModel> {
    return new Promise<LigaModel>((resolve, reject) => {
      apiClient2
        .post("/ligas/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al crear la liga:", error);
          reject(error);
        });
    });
  }

  // Actualizar una liga existente
  updateLiga(id: number, data: FormData): Promise<LigaModel> {
    return new Promise<LigaModel>((resolve, reject) => {
      apiClient2
        .patch(`/ligas/${id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error al actualizar la liga con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  // Eliminar una liga
  deleteLiga(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient2
        .delete(`/ligas/${id}/`)
        .then(() => resolve())
        .catch((error) => {
          console.error(`Error al eliminar la liga con ID ${id}:`, error);
          reject(error);
        });
    });
  }
}

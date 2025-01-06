import { DeporteModel } from "../../models/partidoyapuesta/DeporteModel";
import apiClient2 from "./interceptorPartidoApuesta";

export class DeporteService {
  // Obtener la lista de todos los deportes
  getDeportes(): Promise<DeporteModel[]> {
    return new Promise<DeporteModel[]>((resolve, reject) => {
      apiClient2
        .get("/deportes/")
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("Error al obtener los deportes:", error);
          reject(error);
        });
    });
  }

  // Obtener un deporte específico por su ID
  getDeporte(id: number): Promise<DeporteModel> {
    return new Promise<DeporteModel>((resolve, reject) => {
      apiClient2
        .get(`/deportes/${id}/`)
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(`Error al obtener el deporte con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  // Crear un nuevo deporte
  createDeporte(data: FormData): Promise<DeporteModel> {
    return new Promise<DeporteModel>((resolve, reject) => {
      apiClient2
        .post("/deportes/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("Error al crear el deporte:", error);
          reject(error);
        });
    });
  }

  // Actualizar un deporte existente
  updateDeporte(id: number, data: FormData): Promise<DeporteModel> {
    return new Promise<DeporteModel>((resolve, reject) => {
      apiClient2
        .put(`/deportes/${id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(`Error al actualizar el deporte con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  // Eliminar un deporte por su ID
  deleteDeporte(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient2
        .delete(`/deportes/${id}/`)
        .then(() => resolve())
        .catch((error) => {
          console.error(`Error al eliminar el deporte con ID ${id}:`, error);
          reject(error);
        });
    });
  }
}

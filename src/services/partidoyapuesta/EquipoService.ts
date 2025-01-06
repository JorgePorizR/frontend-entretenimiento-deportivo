import { EquipoModel } from "../../models/partidoyapuesta/EquipoModel";
import apiClient2 from "./interceptorPartidoApuesta";

export class EquipoService {
  getEquipos(): Promise<EquipoModel[]> {
    return new Promise<EquipoModel[]>((resolve, reject) => {
      apiClient2
        .get("/equipos/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  getEquipo(id: number): Promise<EquipoModel> {
    return new Promise<EquipoModel>((resolve, reject) => {
      apiClient2
        .get(`/equipos/${id}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  createEquipo(data: FormData): Promise<EquipoModel> {
    return new Promise<EquipoModel>((resolve, reject) => {
      apiClient2
        .post("/equipos/", data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error("Error al crear el equipo:", error);
          reject(error);
        });
    });
  }

  updateEquipo(id: number, data: FormData): Promise<EquipoModel> {
    return new Promise<EquipoModel>((resolve, reject) => {
      apiClient2
        .patch(`/equipos/${id}/`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(`Error al actualizar el equipo con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  deleteEquipo(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient2
        .delete(`/equipos/${id}/`)
        .then(() => resolve())
        .catch((error) => {
          console.error(`Error al eliminar el equipo con ID ${id}:`, error);
          reject(error);
        });
    });
  }

}
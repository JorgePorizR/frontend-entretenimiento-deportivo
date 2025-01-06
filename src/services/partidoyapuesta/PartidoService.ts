import { PartidoBody } from "../../models/partidoyapuesta/PartidoBody";
import { PartidoModel } from "../../models/partidoyapuesta/PartidoModel";
import apiClient2 from "./interceptorPartidoApuesta"; 

export class PartidoService {
  // Obtener la lista de todos los partidos
  getPartidos(): Promise<PartidoModel[]> {
    return new Promise<PartidoModel[]>((resolve, reject) => {
      apiClient2
        .get("/partidos/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los partidos:", error);
          reject(error);
        });
    });
  }

  // Obtener un partido por su ID
  getPartido(id: number): Promise<PartidoModel> {
    return new Promise<PartidoModel>((resolve, reject) => {
      apiClient2
        .get(`/partidos/${id}/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error al obtener el partido con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  // Crear un nuevo partido
  createPartido(data: PartidoBody): Promise<PartidoModel> {
    return new Promise<PartidoModel>((resolve, reject) => {
      apiClient2
        .post("/partidos/", data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al crear el partido:", error);
          reject(error);
        });
    });
  }

  // Actualizar un partido existente
  updatePartido(id: number, data: PartidoBody): Promise<PartidoModel> {
    return new Promise<PartidoModel>((resolve, reject) => {
      apiClient2
        .patch(`/partidos/${id}/`, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error al actualizar el partido con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  // Eliminar un partido existente
  deletePartido(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient2
        .delete(`/partidos/${id}/`)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(`Error al eliminar el partido con ID ${id}:`, error);
          reject(error);
        });
      });
    }

    iniciarPartido(id: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        apiClient2
          .patch(`/partidos/${id}/iniciar/`)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error(`Error al iniciar el partido con ID ${id}:`, error);
            reject(error);
          });
      });
    }

    finalizarPartido(id: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        apiClient2
          .patch(`/partidos/${id}/finalizar/`)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error(`Error al finalizar el partido con ID ${id}:`, error);
            reject(error);
          });
      });
    }

    cancelarPartido(id: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        apiClient2
          .patch(`/partidos/${id}/cancelar/`)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error(`Error al cancelar el partido con ID ${id}:`, error);
            reject(error);
          });
      });
    }

    actualizarMarcadoresPartido(partidoId: number, marcador1: number, marcador2: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        apiClient2
          .patch(`/partidos/${partidoId}/actualizar-marcadores/`, { marcador1, marcador2 })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error(`Error al actualizar los marcadores del partido con ID ${partidoId}:`, error);
            reject(error);
          });
      });
    }

    agregarEventoPartido(partidoId: number, descripcion: string, equipo_id: number, minuto: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        apiClient2
          .post(`/partidos/${partidoId}/agregar-evento/`, { descripcion, equipo_id, minuto })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            console.error(`Error al agregar un evento al partido con ID ${partidoId}:`, error);
            reject(error);
          });
      });
    }
}
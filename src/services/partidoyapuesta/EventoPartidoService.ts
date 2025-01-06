import { EventoPartidoBody } from "../../models/partidoyapuesta/EventoPartidoBody";
import { EventoPartidoModel } from "../../models/partidoyapuesta/EventoPartidoModel";
import apiClient2 from "./interceptorPartidoApuesta"; 

export class EventoPartidoService {
  // Obtener la lista de todos los eventos de partidos
  getEventosPartido(): Promise<EventoPartidoModel[]> {
    return new Promise<EventoPartidoModel[]>((resolve, reject) => {
      apiClient2
        .get("/eventos-partido/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los eventos de partidos:", error);
          reject(error);
        });
    });
  }

  // Obtener un evento de partido por su ID
  getEventoPartido(id: number): Promise<EventoPartidoModel> {
    return new Promise<EventoPartidoModel>((resolve, reject) => {
      apiClient2
        .get(`/eventos-partido/${id}/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error al obtener el evento de partido con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  // Crear un nuevo evento de partido
  createEventoPartido(data: EventoPartidoBody): Promise<EventoPartidoModel> {
    return new Promise<EventoPartidoModel>((resolve, reject) => {
      apiClient2
        .post("/eventos-partido/", data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al crear el evento de partido:", error);
          reject(error);
        });
    });
  }

  // Actualizar un evento de partido existente
  updateEventoPartido(id: number, data: EventoPartidoBody): Promise<EventoPartidoModel> {
    return new Promise<EventoPartidoModel>((resolve, reject) => {
      apiClient2
        .patch(`/eventos-partido/${id}/`, data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error(`Error al actualizar el evento de partido con ID ${id}:`, error);
          reject(error);
        });
    });
  }

  // Eliminar un evento de partido existente
  deleteEventoPartido(id: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient2
        .delete(`/eventos-partido/${id}/`)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.error(`Error al eliminar el evento de partido con ID ${id}:`, error);
          reject(error);
        });
    });
  }
}

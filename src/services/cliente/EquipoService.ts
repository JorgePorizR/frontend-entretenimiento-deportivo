import { Equipo } from "../../models/cliente/Equipo";
import apiClient3 from "./InterceptorCliente";

export class EquipoService {
  getEquipoById(equipoId: number): Promise<Equipo> {
    return new Promise<Equipo>((resolve, reject) => {
      apiClient3
        .get(`/equipos/${equipoId}/partidos/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener las ligas:", error);
          reject(error);
        });
    });
  }
}
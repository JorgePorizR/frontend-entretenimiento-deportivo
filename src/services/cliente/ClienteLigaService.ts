import { LigaPartidos } from "../../models/cliente/LigaPartidos";
import apiClient3 from "./InterceptorCliente";

export class ClienteLigaService {
  getLigasWithPartidos(deporte: number): Promise<LigaPartidos[]> {
    return new Promise<LigaPartidos[]>((resolve, reject) => {
      apiClient3
        .get(`/ligas/deporte/${deporte}/`)
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

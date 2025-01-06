import { PartidoEventos } from "../../models/cliente/PartidoEventos";
import { PartidoMultiplicadores } from "../../models/cliente/PartidoMultiplicadores";
import apiClient3 from "./InterceptorCliente";

export class PartidoService {
  getPartidoById(partidoId: number): Promise<PartidoEventos> {
    return new Promise<PartidoEventos>((resolve, reject) => {
      apiClient3
        .get(`/partidos/${partidoId}/eventos/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener el partido:", error);
          reject(error);
        });
    });
  }

  getMultiplicadoresPartido(partidoId: number): Promise<PartidoMultiplicadores> {
    return new Promise<PartidoMultiplicadores>((resolve, reject) => {
      apiClient3
        .get(`/partidos/${partidoId}/multiplicadores/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los multiplicadores del partido:", error);
          reject(error);
        });
    });
  }
}
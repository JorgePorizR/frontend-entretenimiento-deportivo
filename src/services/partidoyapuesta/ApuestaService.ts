import { MontoTotalPartido } from "../../models/partidoyapuesta/montoTotal/MontoTotalPartido";
import { MontoTotalUsuario } from "../../models/partidoyapuesta/montoTotal/MontoTotalUsuario";
import apiClient2 from "./interceptorPartidoApuesta";

export class ApuestaService {

  getMontoTotalPartido(id: number): Promise<MontoTotalPartido> {
    return new Promise<MontoTotalPartido>((resolve, reject) => {
      apiClient2
        .get(`/apuestas/monto-total/${id}/partido/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  getMontoTotalUsuario(id: number): Promise<MontoTotalUsuario> {
    return new Promise<MontoTotalUsuario>((resolve, reject) => {
      apiClient2
        .get(`/apuestas/monto-total/${id}/usuario/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
}

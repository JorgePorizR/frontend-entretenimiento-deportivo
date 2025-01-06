import { ApuestaClienteBody } from "../../models/cliente/ApuestaClienteBody";
import { ApuestaModel } from "../../models/partidoyapuesta/ApuestaModel";
import apiClient3 from "./InterceptorCliente";

export class ApuestaClienteService {
  getHistorialApuestaCliente(id: number): Promise<ApuestaModel[]> {
    return new Promise<ApuestaModel[]>((resolve, reject) => {
      apiClient3
        .get(`/apuestas/historial/${id}/`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  crearApuesta(apuesta: ApuestaClienteBody): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      apiClient3
        .post("/apuestas/", apuesta)
        .then(() => {
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
}
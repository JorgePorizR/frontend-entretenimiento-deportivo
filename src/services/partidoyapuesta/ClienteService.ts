import { ApuestaModel } from "../../models/partidoyapuesta/ApuestaModel";
import { UserModel } from "../../models/user/UserModel";
import apiClient from "../interceptor";
import apiClient2 from "./interceptorPartidoApuesta";

export class ClienteService {
  getClientList(): Promise<UserModel[]> {
    return new Promise<UserModel[]>((resolve, reject) => {
      apiClient
        .get("/auth/clientes/")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  getHistorialCliente(id: number): Promise<ApuestaModel[]> {
    return new Promise<ApuestaModel[]>((resolve, reject) => {
      apiClient2
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
}

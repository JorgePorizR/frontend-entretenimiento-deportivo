import { BilleteraCliente } from "../../models/cliente/BilleteraCliente";
import { MovimientoCliente } from "../../models/cliente/MovimientoCliente";
import apiClient4 from "./interceptorBilletera";

export class BilleteraService {
  getBilleteraByCliente(clienteId: number): Promise<BilleteraCliente> {
    return new Promise<BilleteraCliente>((resolve, reject) => {
      apiClient4
        .get(`/Billeteras/usuario/${clienteId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener la billetera del cliente:", error);
          reject(error);
        });
    });
  }

  getMovimientosByCliente(clienteId: number): Promise<MovimientoCliente[]> {
    return new Promise<MovimientoCliente[]>((resolve, reject) => {
      apiClient4
        .get(`/Movimientos/usuario/${clienteId}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los movimientos del cliente:", error);
          reject(error);
        });
    });
  }
}

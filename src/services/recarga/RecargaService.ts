import { BilleteraList } from "../../models/billetera/BilleteraList";
import { Movimiento } from "../../models/billetera/Movimiento";
import apiClient from "./interceptorRecarga";

export class RecargaService {
  getBilleteras(): Promise<BilleteraList[]> {
    return new Promise<BilleteraList[]>((resolve, reject) => {
      apiClient
        .get("/Billeteras")
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  searchBilletera(search: string): Promise<BilleteraList[]> {
    return new Promise<BilleteraList[]>((resolve, reject) => {
      apiClient
        .get(`/Billeteras/search?search=${search}`)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  recargaMovimiento(
    userId: number,
    monto: number,
    descripcion: string,
    file: File
  ): Promise<void> {
    const formData = new FormData();
    formData.append("userId", userId.toString());
    formData.append("monto", monto.toString());
    formData.append("descripcion", descripcion);
    formData.append("file", file);

    return new Promise<void>((resolve, reject) => {
      apiClient
        .post("/Movimientos/recargar", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  ingresoMovimiento(
    userId: number,
    monto: number,
    descripcion: string
  ): Promise<Movimiento> {
    return new Promise<Movimiento>((resolve, reject) => {
      apiClient
        .post("/Movimientos/Ingreso", { userId, monto, descripcion })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }

  salidaMovimiento(
    userId: number,
    monto: number,
    descripcion: string
  ): Promise<Movimiento> {
    return new Promise<Movimiento>((resolve, reject) => {
      apiClient
        .post("/Movimientos/Salida", { userId, monto, descripcion })
        .then((response) => resolve(response.data))
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  }
}

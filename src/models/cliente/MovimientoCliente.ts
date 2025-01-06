export interface MovimientoCliente {
  id:          number;
  tipo:        number; // 0 = Salida, 1 = Entrada
  monto:       number;
  userId:      number;
  comprobante: string;
  descripcion: string;
}

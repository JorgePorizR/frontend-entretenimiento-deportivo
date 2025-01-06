export interface ApuestaClienteBody {
  usuario_id:    number;
  partido_id:    number;
  tipo_apuesta:  number; // 0 = Ganador, 1 = Empate
  monto:         number;
  equipo_id:     number;
  multiplicador: number;
}

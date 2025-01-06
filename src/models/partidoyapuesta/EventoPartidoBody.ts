export interface EventoPartidoBody {
  id:          number;
  partido_id:  number;
  descripcion: string;
  equipo_id:   number;
  minuto:      number;
}
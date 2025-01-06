export interface EventoPartidoModel {
  id:          number;
  partido:     Partido;
  descripcion: string;
  equipo:      Equipo;
  minuto:      number;
}

export interface Equipo {
  id:     number;
  nombre: string;
  imagen: string;
}

export interface Partido {
  id:      number;
  resumen: string;
}

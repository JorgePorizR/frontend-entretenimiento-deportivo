export interface PartidoEventos {
  id:               number;
  equipo1:          Equipo1;
  equipo2:          Equipo1;
  liga:             Liga;
  marcador1:        number;
  marcador2:        number;
  fecha_hora:       Date;
  duracion_minutos: number;
  estado:           number;
  eventos:          Evento[];
}

export interface Equipo1 {
  id:     number;
  nombre: string;
  imagen: string;
}

export interface Evento {
  id:          number;
  partido:     Partido;
  descripcion: string;
  equipo:      Equipo1;
  minuto:      number;
}

export interface Partido {
  id:      number;
  resumen: string;
}

export interface Liga {
  id:      number;
  nombre:  string;
  deporte: Equipo1;
  logo:    string;
}

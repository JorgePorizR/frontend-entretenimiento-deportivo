export interface Equipo {
  id:               number;
  nombre:           string;
  imagen:           string;
  partidos_pasados: Partidos[];
  partidos_futuros: Partidos[];
}

export interface Partidos {
  id:               number;
  equipo1:          Equipo1;
  equipo2:          Equipo1;
  liga:             Liga;
  marcador1:        number;
  marcador2:        number;
  fecha_hora:       Date;
  duracion_minutos: number;
  estado:           number;
}

export interface Equipo1 {
  id:     number;
  nombre: string;
  imagen: string;
}

export interface Liga {
  id:      number;
  nombre:  string;
  deporte: Equipo1;
  logo:    string;
}

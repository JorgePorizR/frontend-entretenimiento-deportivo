export interface Partido {
  id:               number;
  equipo1:          Deporte;
  equipo2:          Deporte;
  liga:             LigaPartidos;
  marcador1:        number;
  marcador2:        number;
  fecha_hora:       Date;
  duracion_minutos: number;
  estado:           number;
}

export interface LigaPartidos {
  id:        number;
  nombre:    string;
  deporte:   Deporte;
  logo:      string;
  partidos?: Partido[];
}

export interface Deporte {
  id:     number;
  nombre: string;
  imagen: string;
}

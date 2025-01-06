export interface PartidoModel {
  id:               number;
  equipo1:          Equipo1;
  equipo2:          Equipo1;
  liga:             Liga;
  marcador1:        number;
  marcador2:        number;
  fecha_hora:       Date;
  duracion_minutos: number;
  estado:           number; // 0 = Pendiente, 1 = En Juego, 2 = Finalizado, 3 = Cancelado
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

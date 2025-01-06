export interface ApuestaModel {
  id:            number;
  usuario_id:    number;
  partido:       Partido;
  tipo_apuesta:  number; // 0 = Ganador, 1 = Empate
  monto:         string;
  equipo:        Equipo;
  estado:        number; // 0 = Pendiente, 1 = Ganadar, 2 = Perdidor, 3 = Cancelado
  created_at:    Date;
  multiplicador: string;
}

export interface Equipo {
  id:     number;
  nombre: string;
  imagen: string;
}

export interface Partido {
  id:               number;
  equipo1:          Equipo;
  equipo2:          Equipo;
  liga:             Liga;
  marcador1:        number;
  marcador2:        number;
  fecha_hora:       Date;
  duracion_minutos: number;
  estado:           number;
}

export interface Liga {
  id:      number;
  nombre:  string;
  deporte: Equipo;
  logo:    string;
}

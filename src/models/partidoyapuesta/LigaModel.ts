export interface LigaModel {
  id:      number;
  nombre:  string;
  deporte: Deporte;
  logo:    string;
}

export interface Deporte {
  id:     number;
  nombre: string;
  imagen: string;
}

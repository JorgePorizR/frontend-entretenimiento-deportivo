
equipo = {
  id,
  nombre,
  imagen
}

deporte = {
  id,
  nombre,
  imagen
}

liga = {
  id,
  nombre,
  idDeporte,
  logo
}

partido = {
  id,
  idEquipo1,
  idEquipo2,
  idLiga,
  marcador1,
  marcador2,
  fechaHora,
  duracionMinutos,
  estado // 0: Pendiente, 1: En Juego, 2: Finalizado 3: Cancelado
}

eventoPartido = {
  id,
  idPartido,
  descripcion,
  idEquipo,
  minuto
}

apuesta = {
  id,
  idUsuario,
  idPartido,
  tipoApuesta, // 0: Ganador, 1: Empate
  monto,
  idEquipo,
  estado // 0: Pendiente, 1: Ganador, 2: Perdedor, 3: Cancelado
}
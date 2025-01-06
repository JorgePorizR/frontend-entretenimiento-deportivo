import DetalleEquipo from "../../pages/client/DetalleEquipo";
import DetallePartido from "../../pages/client/DetallePartido";
import HistorialCliente from "../../pages/client/HistorialCliente";
import HomeClient from "../../pages/client/HomeClient";
import LigasDeporte from "../../pages/client/LigasDeporte";

const ClientRoutes = [
  {
    path: "cliente/home",
    element: <HomeClient />,
  },
  {
    path: "cliente/ligas/:id",
    element: <LigasDeporte />,
  },
  {
    path: "cliente/equipo/:id",
    element: <DetalleEquipo />,
  },
  {
    path: "cliente/partido/:id",
    element: <DetallePartido />,
  },
  {
    path: "cliente/historial/:id",
    element: <HistorialCliente />,
  }
];

export default ClientRoutes;

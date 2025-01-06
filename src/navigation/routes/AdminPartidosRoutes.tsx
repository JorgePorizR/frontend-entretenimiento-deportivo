import ClientPartido from "../../pages/partido/ClientPartido";
import HomePartido from "../../pages/partido/HomePartido";


const AdminPartidosRoutes = [
  {
    path: "admin/partidos/home",
    element: <HomePartido />,
  },
  {
    path: "admin/partidos/clientes",
    element: <ClientPartido />,
  },
];

export default AdminPartidosRoutes;

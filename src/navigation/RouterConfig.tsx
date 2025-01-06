import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App";
import LoginComponent from "../pages/auth/LoginComponent";
import RegisterComponent from "../pages/auth/RegisterComponent";
import AdminUsuariosRoutes from "./routes/AdminUsuariosRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import AdminRecargasRoutes from "./routes/AdminRecargasRoutes";
import AdminPartidosRoutes from "./routes/AdminPartidosRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "user/login",
    element: <LoginComponent />,
  },
  {
    path: "user/register",
    element: <RegisterComponent />,
  },
  ...AdminUsuariosRoutes,
  ...ClientRoutes,
  ...AdminRecargasRoutes,
  ...AdminPartidosRoutes,
  {
    path: "*",
    element: <div className="bg-black h-screen">
      <h1 className="text-white text-center text-4xl pt-6 font-bold">404 Not Found</h1>
    </div>,
  }
]);

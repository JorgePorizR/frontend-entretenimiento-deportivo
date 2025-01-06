import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../slices/useSlice";
import { UserService } from "../../services/UserService";
import { useAppDispatch } from "../../hooks/reduxHooks";
import NavBar from "../../components/NavBar";
import { UserLoginRes } from "../../models/user/UserLoginRes";

function LoginComponent() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();

  const validateForm = () => {
    if (!userName.trim()) {
      setErrorMessage("El nombre de usuario es requerido");
      return false;
    }
    if (!password.trim()) {
      setErrorMessage("La contraseña es requerida");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    return true;
  };

  const onLoginClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage("");

    if (!validateForm()) return;

    new UserService()
      .login(userName, password)
      .then((response: UserLoginRes) => {
        dispatch(loginUser(userName));
        localStorage.setItem(
          "isAdminUsuario",
          response.user.is_admin_usuario.toString()
        );
        localStorage.setItem(
          "isAdminRecarga",
          response.user.is_admin_recarga.toString()
        );
        localStorage.setItem(
          "isAdminPartido",
          response.user.is_admin_partido.toString()
        );
        localStorage.setItem("isCliente", response.user.is_cliente.toString());
        if (
          response.user.is_admin_usuario ||
          response.user.is_admin_recarga ||
          response.user.is_admin_partido
        ) {
          navigate("/");
        } else {
          navigate("/cliente/home");
        }
      })
      .catch((error) => {
        console.log("Login error: ", error);
        if (error.response?.status === 401) {
          setErrorMessage("Usuario o contraseña incorrectos");
        } else if (error.response?.status === 400) {
          setErrorMessage("Datos de inicio de sesión inválidos");
        } else {
          setErrorMessage(
            "Error al iniciar sesión. Por favor, intente nuevamente"
          );
        }
      });
  };

  return (
    <div className="bg-black h-screen">
      <NavBar />
      <div className="flex flex-col justify-center">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5 text-white">
            LOGIN
          </h1>
          <div className="bg-gray-800 shadow-lg w-full rounded-lg divide-y divide-gray-700">
            {errorMessage && (
              <div className="px-5 py-2 text-red-500 text-sm text-center bg-red-100 bg-opacity-10">
                {errorMessage}
              </div>
            )}
            <form className="px-5 py-7" onSubmit={onLoginClick}>
              <label
                className="font-semibold text-sm text-gray-300 pb-1 block"
                htmlFor="username"
              >
                Nombre de usuario
              </label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="example"
                required
                className="border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                onChange={(e) => {
                  setUserName(e.target.value);
                  setErrorMessage("");
                }}
              />
              <label
                className="font-semibold text-sm text-gray-300 pb-1 block"
                htmlFor="password"
              >
                Contrase&ntilde;a
              </label>
              <input
                id="password"
                name="password"
                placeholder="***************"
                type="password"
                required
                className="border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
              />
              <button
                type="submit"
                className="transition duration-200 bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
                <span className="inline-block mr-2">Iniciar Sesi&oacute;n</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-4 h-4 inline-block"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  ></path>
                </svg>
              </button>
              <div className="mt-5 text-center text-gray-400 text-sm">
                <span>No tienes cuenta? </span>
                <span>
                  <a href="/user/register" className="text-blue-500">
                    Reg&iacute;strate
                  </a>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;

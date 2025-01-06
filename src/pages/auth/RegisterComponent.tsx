import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserService } from "../../services/UserService";
import NavBar from "../../components/NavBar";

function RegisterComponent() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    // Validación de first name
    if (!firstName.trim()) {
      setErrorMessage("El nombre es requerido");
      return false;
    }

    // Validación de last name
    if (!lastName.trim()) {
      setErrorMessage("El apellido es requerido");
      return false;
    }

    // Validación de username
    if (!username.trim()) {
      setErrorMessage("El nombre de usuario es requerido");
      return false;
    }
    if (username.length < 3) {
      setErrorMessage("El nombre de usuario debe tener al menos 3 caracteres");
      return false;
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setErrorMessage("El correo electrónico es requerido");
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage("El correo electrónico no es válido");
      return false;
    }

    // Validación de password
    if (!password.trim()) {
      setErrorMessage("La contraseña es requerida");
      return false;
    }
    if (password.length < 8) {
      setErrorMessage("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const doRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setErrorMessage("");

    if (!validateForm()) return;

    new UserService()
      .register(firstName, lastName, username, email, password)
      .then(() => {
        navigate("/user/login");
      })
      .catch((error) => {
        console.log(error);
        if (error.response?.data?.username) {
          setErrorMessage("El nombre de usuario ya existe");
        } else if (error.response?.data?.email) {
          setErrorMessage("El correo electrónico ya está registrado");
        } else if (error.response?.status === 400) {
          setErrorMessage("Datos de registro inválidos");
        } else {
          setErrorMessage(
            "Error al registrar usuario. Por favor, intente nuevamente"
          );
        }
      });
  };

  return (
    <div className="bg-black max-h-max">
      <NavBar />
      <div className="flex flex-col justify-center">
        <div className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
          <h1 className="font-bold text-center text-2xl mb-5 text-white">
            REGISTER
          </h1>
          <div className="bg-gray-800 shadow-lg w-full rounded-lg divide-y divide-gray-700">
            {errorMessage && (
              <div className="px-5 py-2 text-red-500 text-sm text-center bg-red-100 bg-opacity-10">
                {errorMessage}
              </div>
            )}
            <form className="px-5 py-7" onSubmit={doRegister}>
              <label className="font-semibold text-sm text-gray-300 pb-1 block">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Nombre"
                required
                className="border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setErrorMessage("");
                }}
              />

              <label className="font-semibold text-sm text-gray-300 pb-1 block">
                Apellido
              </label>
              <input
                type="text"
                placeholder="Apellido"
                required
                className="border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                onChange={(e) => {
                  setLastName(e.target.value);
                  setErrorMessage("");
                }}
              />

              <label className="font-semibold text-sm text-gray-300 pb-1 block">
                Nombre de usuario
              </label>
              <input
                type="text"
                placeholder="username"
                required
                className="border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage("");
                }}
              />

              <label className="font-semibold text-sm text-gray-300 pb-1 block">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                required
                className="border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage("");
                }}
              />

              <label className="font-semibold text-sm text-gray-300 pb-1 block">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="***************"
                required
                className="border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
              />

              <label className="font-semibold text-sm text-gray-300 pb-1 block">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                placeholder="***************"
                required
                className="border border-gray-700 bg-gray-900 text-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setErrorMessage("");
                }}
              />

              <button
                type="submit"
                className="transition duration-200 bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 text-white w-full py-2.5 rounded-lg text-sm font-semibold"
              >
                Registrarse
              </button>

              <div className="mt-5 text-center text-gray-400 text-sm">
                <span>¿Ya tienes cuenta? </span>
                <a href="/user/login" className="text-blue-500">
                  Inicia sesión
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterComponent;

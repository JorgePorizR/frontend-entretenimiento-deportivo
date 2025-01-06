import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import useAdminProtection from "../../navigation/useAdminProtection";
import { UserService } from "../../services/UserService";
import { UserModel } from "../../models/user/UserModel";
import { UserBody } from "../../models/user/UserBody";
import UserFormModal from "../../components/user/UserFormModal";
import ChangePasswordModal from "../../components/user/ChangePasswordModal";
import { useAuth } from "../../hooks/useAuth";

function CrudUser() {
  useAdminProtection();
  const [users, setUsers] = useState<UserModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userService = new UserService();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserModel | undefined>(
    undefined
  );
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUserForPassword, setSelectedUserForPassword] = useState<
    UserModel | undefined
  >(undefined);

  const {
    //logout,
    username,
  } = useAuth({ redirectWithoutToken: false });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userList = await userService.getUserList();
      setUsers(userList);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        await userService.deleteUser(userId);
        loadUsers(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleAdd = async (userData: UserBody) => {
    try {
      await userService.createUser(userData);
      loadUsers();
    } catch (error) {
      alert("Error al crear el usuario, el nombre de usuario ya existe");
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const handleEdit = async (userData: UserBody) => {
    if (!selectedUser) return;
    try {
      /*if (userData.username === username) {
        const confirm = window.confirm('Estas actualizando tu usuario es necesario iniciar sesión nuevamente ¿Desea Continuar?');
        if (confirm) {
          await userService.updateUser(selectedUser.id, userData);
          logout();
          return;
        } else {
          return;
        }
      }*/
      await userService.updateUser(selectedUser.id, userData);
      loadUsers();
      if (userData.username === username) {
        new UserService()
          .getInfoUser()
          .then((response) => {
            localStorage.setItem(
              "isAdminUsuario",
              response.is_admin_usuario.toString()
            );
            localStorage.setItem(
              "isAdminRecarga",
              response.is_admin_recarga.toString()
            );
            localStorage.setItem(
              "isAdminPartido",
              response.is_admin_partido.toString()
            );
            localStorage.setItem("isCliente", response.is_cliente.toString());
            if (!response.is_admin_usuario) {
              alert("Se ha actualizado tu usuario, ya no tienes los permisos para seguir aqui, seras redirigido al inicio");
            }
          })
          .catch((error) => {
            console.log("Error: ", error);
          });
      }
    } catch (error) {
      alert("Error al actualizar el usuario, el nombre de usuario ya existe");
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const handlePasswordChange = async (password: string) => {
    if (!selectedUserForPassword) return;

    try {
      await userService.updateUser(selectedUserForPassword.id, { password });
      // No necesitamos recargar la lista ya que la contraseña no afecta la vista
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  const openAddModal = () => {
    setSelectedUser(undefined);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserModel) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openPasswordModal = (user: UserModel) => {
    setSelectedUserForPassword(user);
    setIsPasswordModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
            onClick={openAddModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add User
          </button>
        </div>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Groups
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {user.groups.map((group) => (
                          <span
                            key={group.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {group.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openPasswordModal(user)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Change Password
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={selectedUser ? handleEdit : handleAdd}
        user={selectedUser}
        title={selectedUser ? "Edit User" : "Add New User"}
      />
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setSelectedUserForPassword(undefined);
        }}
        onSubmit={handlePasswordChange}
        username={selectedUserForPassword?.username || ""}
      />
    </div>
  );
}

export default CrudUser;

import { useEffect, useState } from "react";
import { UserBody } from "../../models/user/UserBody";
import { UserModel } from "../../models/user/UserModel";
import { UserGroup } from "../../models/user/UserGroup";
import { UserService } from "../../services/UserService";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserBody) => Promise<void>;
  user?: UserModel; // Si existe, estamos en modo edición
  title: string;
}

function UserFormModal({ isOpen, onClose, onSubmit, user, title }: UserFormModalProps) {
  const [formData, setFormData] = useState<UserBody>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    groups: [],
  });
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const userService = new UserService();

  useEffect(() => {
    loadGroups();
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        username: user.username,
        email: user.email,
        groups: user.groups.map((g) => g.id),
      });
    } else {
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        groups: [],
      });
    }
  }, [user]);

  const loadGroups = async () => {
    try {
      const groupList = await userService.getUserGroups();
      setGroups(groupList);
    } catch (error) {
      console.error("Error loading groups:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        password: "",
        groups: [],
      });
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {!user && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={!user}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Groups</label>
              <div className="mt-2 space-y-2">
                {groups.map((group) => (
                  <label key={group.id} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={formData.groups?.includes(group.id)}
                      onChange={(e) => {
                        const newGroups = e.target.checked
                          ? [...(formData.groups || []), group.id]
                          : formData.groups?.filter((id) => id !== group.id) || [];
                        setFormData({ ...formData, groups: newGroups });
                      }}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-600">{group.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserFormModal;

import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { logoutUser } from "../slices/useSlice";
import { TOKEN_KEY } from "../utils/CONSTANTS";
import { getLocalStorage } from "../utils/LocalStorageUtils";
import { UserService } from "../services/UserService";

interface Props {
  redirectWithoutToken: boolean;
}
export const useAuth = ({ redirectWithoutToken }: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = getLocalStorage(TOKEN_KEY);
  const username = useAppSelector((state) => state.user.username);


  const logout = () => {

    try {
      new UserService().logout();
    } catch (error) {
      console.log(error);
    }

    dispatch(logoutUser());
    localStorage.removeItem(TOKEN_KEY);
    navigate("/user/login");
  };
  return { token, logout, username };
};

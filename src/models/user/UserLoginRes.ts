export interface UserLoginRes {
  message: string;
  user:    User;
}

export interface User {
  id:       number;
  username: string;
  is_admin_usuario: boolean;
  is_cliente:    boolean;
  is_admin_recarga: boolean;
  is_admin_partido: boolean;
}
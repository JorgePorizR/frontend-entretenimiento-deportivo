export interface UserInfo {
  id:       number;
  first_name: string;
  last_name:  string;
  username: string;
  email:    string;
  groups:   Group[];
  is_admin_usuario: boolean;
  is_cliente:    boolean;
  is_admin_recarga: boolean;
  is_admin_partido: boolean;
}

export interface Group {
  id:   number;
  name: string;
}

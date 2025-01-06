export interface UserModel {
  id:       number;
  first_name: string;
  last_name:  string;
  username: string;
  email:    string;
  groups:   Group[];
}

export interface Group {
  id:   number;
  name: string;
}

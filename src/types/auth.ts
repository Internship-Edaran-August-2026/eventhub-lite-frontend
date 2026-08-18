export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Admin";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** Shape of a record in db.json's "auth" table (json-server backend). */
export interface AuthRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  role: AuthUser["role"];
  token: string;
}

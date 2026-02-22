export interface Usuario {
  id?: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario; 
}
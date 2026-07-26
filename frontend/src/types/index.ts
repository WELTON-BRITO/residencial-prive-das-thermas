export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: UserSession;
}

export interface AuthMeResponse {
  user: UserSession;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface LoginResponse {
    id: string;
    name: string;
    email: string;
    token: string;
}
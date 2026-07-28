export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthMeResponse {
  user: UserSession;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthContextData {
  user: UserSession | null;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
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
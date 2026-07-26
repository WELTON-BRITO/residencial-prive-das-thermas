import api from '../api/axios';
import type { AuthResponse, LoginRequest, AuthMeResponse } from '../types';

export async function login({ email, password }: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', { email, password });
  return response.data;
}

export async function fetchProfile(): Promise<AuthMeResponse> {
  const response = await api.get<AuthMeResponse>('/auth/me');
  return response.data;
}

import api from '../api/axios';
import type { CreateClientFormData, Client } from '../types/client';

export async function createClient(data: CreateClientFormData): Promise<Client> {
  const response = await api.post<Client>('/clientes', data);
  return response.data;
}

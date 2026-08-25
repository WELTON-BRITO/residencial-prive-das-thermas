import api from '../api/axios';
import type { CreateClientFormData, Client, ClientSuggestion } from '../types/client';

export async function createClient(data: CreateClientFormData): Promise<Client> {
  const response = await api.post<Client>('/clientes', data);
  return response.data;
}

export async function searchClients(query: string, signal?: AbortSignal): Promise<ClientSuggestion[]> {
  const response = await api.get<ClientSuggestion[]>('/clientes', { params: { q: query }, signal });
  return response.data;
}

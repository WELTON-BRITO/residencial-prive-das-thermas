import api from '../api/axios';
import type { CreateReservationDTO, Reservation } from '../types/reservation';

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await api.get<Reservation[]>('/agendamentos');
  return response.data;
}

export async function createReservation(data: CreateReservationDTO): Promise<Reservation> {
  const response = await api.post<Reservation>('/agendamentos', data);
  return response.data;
}

export async function updateReservation(id: string, data: Partial<CreateReservationDTO & { paidAmount?: number }>): Promise<Reservation> {
  const response = await api.put<Reservation>(`/agendamentos/${id}`, data);
  return response.data;
}

export async function deleteReservation(id: string): Promise<void> {
  await api.delete(`/agendamentos/${id}`);
}

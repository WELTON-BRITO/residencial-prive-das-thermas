import { useCallback, useEffect, useState } from 'react';
import { fetchReservations, createReservation, updateReservation, deleteReservation } from '../services/reservationService';
import type { Reservation, CreateReservationDTO } from '../types/reservation';

export function useReservation() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchReservations();
      setReservations(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (dto: CreateReservationDTO) => {
    const res = await createReservation(dto);
    setReservations((prev) => [...prev, res]);
    return res;
  };

  const update = async (id: string, dto: Partial<CreateReservationDTO & { paidAmount?: number }>) => {
    const res = await updateReservation(id, dto);
    setReservations((prev) => prev.map((r) => (r.id === id ? res : r)));
    return res;
  };

  const remove = async (id: string) => {
    await deleteReservation(id);
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  return { reservations, loading, load, create, update, remove };
}

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ReservationCalendar } from '../../components/agendamento/ReservationCalendar/ReservationCalendar';
import { ReservationForm } from '../../components/agendamento/ReservationForm';
import { ReservationGrid } from '../../components/agendamento/ReservationGrid';
import { useReservation } from '../../hooks/useReservation';
import type { Reservation } from '../../types/reservation';

export default function AgendamentoPage() {
  const { reservations, create, update, remove } = useReservation();
  const [checkIn, setCheckIn] = useState<string | undefined>(undefined);
  const [checkOut, setCheckOut] = useState<string | undefined>(undefined);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | undefined>(undefined);

  const handleSubmit = async (data: any) => {
    if (selectedReservation) {
      await update(selectedReservation.id, data);
      setSelectedReservation(undefined);
    } else {
      await create(data);
    }
    setCheckIn(data.checkIn);
    setCheckOut(data.checkOut);
  };

  const handleCancelEdit = () => {
    setSelectedReservation(undefined);
    setCheckIn(undefined);
    setCheckOut(undefined);
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setCheckIn(reservation.checkIn);
    setCheckOut(reservation.checkOut);
  };

  const handleDelete = async (id: string) => {
    await remove(id);
    if (selectedReservation?.id === id) {
      handleCancelEdit();
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>Agendamento</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}>
        <ReservationCalendar reservations={reservations} checkIn={checkIn} checkOut={checkOut} />
      </Box>
      <Box sx={{ mt: 2 }}>
        <ReservationForm
          selectedReservation={selectedReservation}
          onCancelEdit={handleCancelEdit}
          onDatesChange={({ checkIn, checkOut }) => {
            setCheckIn(checkIn);
            setCheckOut(checkOut);
          }}
          onSubmit={handleSubmit}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <ReservationGrid reservations={reservations} onDelete={handleDelete} onEdit={handleEdit} />
      </Box>
    </Box>
  );
}
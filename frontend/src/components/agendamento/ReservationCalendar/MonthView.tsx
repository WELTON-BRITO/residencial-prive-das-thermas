import { Box } from '@mui/material';
import dayjs from 'dayjs';
import { DayCell } from './DayCell';
import { getReservationStatus } from './ReservationPainter';
import type { Reservation } from '../../../types/reservation';

interface Props {
  month: number;
  year: number;
  reservations: Reservation[];
  checkIn?: string;
  checkOut?: string;
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export function MonthView({ month, year, reservations, checkIn, checkOut }: Props) {
  const firstDay = dayjs(new Date(year, month, 1));
  const daysInMonth = firstDay.daysInMonth();
  const firstWeekDay = firstDay.day();
  const totalCells = 42;
  const cells = Array.from({ length: totalCells }, (_, index) => index - firstWeekDay + 1);

  return (
    <Box sx={{ border: '1px solid #E0E0E0', borderRadius: 2, p: 1, backgroundColor: '#FFFFFF' }}>
      <Box sx={{ textAlign: 'center', fontWeight: 700, color: '#D32F2F', mb: 1 }}>
        {monthNames[month]}/{year}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(30px, 1fr))', gap: 0.5, mb: 0.5 }}>
        {weekDays.map((day) => (
          <Box key={day} sx={{ textAlign: 'center', fontWeight: 700, color: '#D32F2F', minHeight: 24 }}>
            {day}
          </Box>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(30px, 1fr))', gap: 0.5 }}>
        {cells.map((dayNumber, index) => {
          const date = firstDay.add(dayNumber - 1, 'day');
          const isValidDay = dayNumber >= 1 && dayNumber <= daysInMonth;
          const status = isValidDay
            ? getReservationStatus(date, reservations, checkIn, checkOut)
            : 'Bloqueado';
          return (
            <DayCell
              key={`${year}-${month}-${index}`}
              day={isValidDay ? dayNumber : null}
              status={status}
            />
          );
        })}
      </Box>
    </Box>
  );
}

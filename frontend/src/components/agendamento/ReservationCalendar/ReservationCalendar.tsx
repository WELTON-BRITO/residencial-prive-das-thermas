import { useMemo, useState } from 'react';
import { Box, Button } from '@mui/material';
import dayjs from 'dayjs';
import { MonthView } from './MonthView';
import { CalendarLegend } from './CalendarLegend';
import type { Reservation } from '../../../types/reservation';

interface Props {
  reservations: Reservation[];
  checkIn?: string;
  checkOut?: string;
}

export function ReservationCalendar({ reservations, checkIn, checkOut }: Props) {
  const [initialMonth, setInitialMonth] = useState(() => dayjs().month());
  const [initialYear, setInitialYear] = useState(() => dayjs().year());

  const months = useMemo(() => {
    return [0, 1, 2, 3].map((offset) => {
      const date = dayjs(new Date(initialYear, initialMonth, 1)).add(offset, 'month');
      return { month: date.month(), year: date.year() };
    });
  }, [initialMonth, initialYear]);

  const handlePrev = () => {
    const current = dayjs(new Date(initialYear, initialMonth, 1)).subtract(1, 'month');
    setInitialMonth(current.month());
    setInitialYear(current.year());
  };

  const handleNext = () => {
    const current = dayjs(new Date(initialYear, initialMonth, 1)).add(1, 'month');
    setInitialMonth(current.month());
    setInitialYear(current.year());
  };

  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outlined" onClick={handlePrev}>&lt;</Button>
        <Button variant="outlined" onClick={handleNext}>&gt;</Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
        {months.map(({ month, year }) => (
          <MonthView key={`${year}-${month}`} month={month} year={year} reservations={reservations} checkIn={checkIn} checkOut={checkOut} />
        ))}
      </Box>

      <CalendarLegend />
    </Box>
  );
}

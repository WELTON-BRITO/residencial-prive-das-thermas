import { useMemo } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';
import type { Reservation } from '../../types/reservation';

interface CalendarProps {
  baseDate?: Date; // first month
  reservations: Reservation[];
  selectedDate?: Date | null;
  onSelectDate?: (d: Date) => void;
}

function monthMatrix(year: number, month: number) {
  const start = dayjs(new Date(year, month, 1)).startOf('week');
  const matrix: dayjs.Dayjs[][] = [];
  let cursor = start;
  for (let week = 0; week < 6; week++) {
    const row: dayjs.Dayjs[] = [];
    for (let i = 0; i < 7; i++) {
      row.push(cursor);
      cursor = cursor.add(1, 'day');
    }
    matrix.push(row);
  }
  return matrix;
}

export function Calendar({ baseDate = new Date(), reservations, selectedDate, onSelectDate }: CalendarProps) {
  const start = dayjs(baseDate).startOf('month');

  const months = useMemo(() => [0, 1, 2].map((i) => start.add(i, 'month')), [start]);

  const reservedMap = useMemo(() => {
    const map = new Map<string, boolean>();
    reservations.forEach((r) => {
      const s = dayjs(r.checkIn);
      const e = dayjs(r.checkOut);
      for (let d = s; d.isBefore(e); d = d.add(1, 'day')) {
        map.set(d.format('YYYY-MM-DD'), true);
      }
    });
    return map;
  }, [reservations]);

  const today = dayjs();

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {months.map((m) => (
        <Paper key={m.toString()} sx={{ p: 1, width: 300 }}>
          <Typography variant="h6" sx={{ textAlign: 'center' }}>{m.format('MMMM/YYYY')}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mt: 1 }}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <Box key={d} sx={{ textAlign: 'center', fontWeight: 700 }}>{d}</Box>
            ))}
            {monthMatrix(m.year(), m.month()).flat().map((day) => {
              const isPast = day.isBefore(today, 'day');
              const key = day.format('YYYY-MM-DD');
              const isReserved = reservedMap.get(key) ?? false;
              const isSelected = selectedDate ? day.isSame(dayjs(selectedDate), 'day') : false;

              let bg = 'transparent';
              if (isPast) bg = '#EEEEEE';
              if (isReserved) bg = '#FFCDD2'; // red
              if (isSelected) bg = '#FFF59D'; // yellow

              return (
                <Button
                  key={key}
                  onClick={() => {
                    if (!isPast) onSelectDate?.(day.toDate());
                  }}
                  disabled={isPast}
                  sx={{ minHeight: 40, bgcolor: bg }}
                >
                  {day.date()}
                </Button>
              );
            })}
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

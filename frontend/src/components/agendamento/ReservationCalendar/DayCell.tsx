import { Box, Typography } from '@mui/material';
import type { ReservationStatus } from './ReservationPainter';

interface Props {
  day: number | null;
  status: ReservationStatus;
}

const statusColors: Record<ReservationStatus, string> = {
  Livre: '#FFFFFF',
  Reservado: '#FFF59D',
  Selecionado: '#F9A825',
  Hoje: '#90CAF9',
  Passado: '#E0E0E0',
  Bloqueado: '#BDBDBD',
  Feriado: '#81D4FA',
  'Fim de Semana': '#E3F2FD',
};

export function DayCell({ day, status }: Props) {
  return (
    <Box
      sx={{
        width: '100%',
        aspectRatio: '1 / 1',
        border: '1px solid #BDBDBD',
        backgroundColor: statusColors[status],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="body2">{day ?? ''}</Typography>
    </Box>
  );
}

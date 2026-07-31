import { Box, Typography } from '@mui/material';

interface Props {
  monthNames: string[];
}

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function CalendarHeader({ monthNames }: Props) {
  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1, mb: 1 }}>
        {monthNames.map((name) => (
          <Typography key={name} variant="subtitle1" sx={{ textAlign: 'center', fontWeight: 700, color: '#D32F2F' }}>
            {name}
          </Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
        {weekDays.map((day) => (
          <Box key={day} sx={{ textAlign: 'center', fontWeight: 700, color: '#D32F2F', minHeight: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {day}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

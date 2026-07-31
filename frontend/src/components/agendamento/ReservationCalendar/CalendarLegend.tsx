import { Box, Typography } from '@mui/material';

interface LegendItem {
  label: string;
  color: string;
}

const legendItems: LegendItem[] = [
  { label: 'Livre', color: '#FFFFFF' },
  { label: 'Reservado', color: '#F9C74F' },
  { label: 'Selecionado', color: '#F9A825' },
  { label: 'Hoje', color: '#90CAF9' },
  { label: 'Passado', color: '#E0E0E0' },
  { label: 'Fim de Semana', color: '#E3F2FD' },
  { label: 'Feriado', color: '#81D4FA' },
];

export function CalendarLegend() {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
      {legendItems.map((item) => (
        <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, backgroundColor: item.color, border: '1px solid #BDBDBD' }} />
          <Typography variant="body2">{item.label}</Typography>
        </Box>
      ))}
    </Box>
  );
}

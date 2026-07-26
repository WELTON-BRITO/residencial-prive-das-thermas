import { Box, Typography } from '@mui/material';

export function NotFoundPage() {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>Página não encontrada</Typography>
      <Typography color="text.secondary">A rota acessada ainda não foi implementada.</Typography>
    </Box>
  );
}

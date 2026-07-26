import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { Dashboard as DashboardIcon, People, Security, TrendingUp } from '@mui/icons-material';

const stats = [
  { label: 'Ativos', value: '24', icon: <DashboardIcon color="primary" />, color: '#dbeafe' },
  { label: 'Usuários', value: '8', icon: <People color="secondary" />, color: '#ede9fe' },
  { label: 'Segurança', value: '99%', icon: <Security color="success" />, color: '#dcfce7' },
  { label: 'Crescimento', value: '+12%', icon: <TrendingUp color="warning" />, color: '#fef3c7' },
];

export function DashboardPage() {
  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Dashboard geral
      </Typography>
      <Grid container spacing={2}>
        {stats.map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ height: '100%', bgcolor: item.color }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.9)' }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Visão geral do sistema
          </Typography>
          <Typography color="text.secondary">
            Este painel marca a base do software com arquitetura escalável, pronto para receber módulos como reservas, finanças e gestão de usuários.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

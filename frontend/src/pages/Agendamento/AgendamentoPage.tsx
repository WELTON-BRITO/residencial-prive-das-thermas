import { Card, CardContent, Typography } from "@mui/material";

export function AgendamentoPage() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" fontWeight={700}>
          Agendamento
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Aqui será desenvolvido o calendário de reservas do condomínio
          Residencial Privê das Thermas.
        </Typography>
      </CardContent>
    </Card>
  );
}
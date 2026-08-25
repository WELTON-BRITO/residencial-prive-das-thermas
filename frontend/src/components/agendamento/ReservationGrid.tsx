import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import dayjs from 'dayjs';
import type { Reservation } from '../../types/reservation';

interface Props {
  reservations: Reservation[];
  onEdit?: (reservation: Reservation) => void;
  onDelete?: (id: string) => void;
}

function formatDate(value: string) {
  if (!value) return '';

  const [date] = value.split('T');
  const [year, month, day] = date.split('-');

  if (!year || !month || !day) return value;

  return `${day}/${month}/${year}`;
}

function formatCurrency(value: number | string) {
  const amount = Number(value) || 0;

  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function ReservationGrid({ reservations, onEdit, onDelete }: Props) {
  const today = dayjs().startOf('day');
  const upcomingReservations = reservations.filter((reservation) => {
    const checkIn = dayjs(reservation.checkIn.slice(0, 10)).startOf('day');
    return checkIn.isValid() && !checkIn.isBefore(today, 'day');
  });

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>            
            <TableCell>Cliente</TableCell>
            <TableCell>Check-in</TableCell>
            <TableCell>Check-out</TableCell>
            <TableCell>Diárias</TableCell>
            <TableCell>Aluguel</TableCell>{
            /*<TableCell>1º Parc</TableCell>
            <TableCell>2º Parc</TableCell>
            <TableCell>3º Parc</TableCell>
            <TableCell>4º Parc</TableCell>*/}
            <TableCell>Pago</TableCell>
            <TableCell>A Pagar</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {upcomingReservations.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.customer?.name ?? ''}</TableCell>
              <TableCell>{formatDate(r.checkIn)}</TableCell>
              <TableCell>{formatDate(r.checkOut)}</TableCell>
              <TableCell>{r.totalNights}</TableCell>
              <TableCell>{formatCurrency(r.rentalAmount)}</TableCell>{
              /*<TableCell>{getInstallmentAmount(r, 1)}</TableCell>
              <TableCell>{getInstallmentAmount(r, 2)}</TableCell>
              <TableCell>{getInstallmentAmount(r, 3)}</TableCell>
              <TableCell>{getInstallmentAmount(r, 4)}</TableCell>*/}
              <TableCell>{formatCurrency(r.paidAmount)}</TableCell>
              <TableCell>{formatCurrency(r.dueAmount)}</TableCell>
              <TableCell>
                <Box>
                  <Button size="small" onClick={() => onEdit?.(r)}>Editar</Button>
                  <Button size="small" color="error" onClick={() => onDelete?.(r.id)}>Cancelar</Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

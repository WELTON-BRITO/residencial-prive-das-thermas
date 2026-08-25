import dayjs from 'dayjs';
import type { Reservation } from '../../../types/reservation';

export type ReservationStatus =
  | 'Livre'
  | 'Reservado'
  | 'Selecionado'
  | 'Hoje'
  | 'Passado'
  | 'Bloqueado'
  | 'Feriado'
  | 'Fim de Semana';

const holidayDates: string[] = [
  // Exemplo de feriados futuros. Preparado para integrar API mais tarde.
  '2026-12-25',
  '2026-01-01',
];

export function isHoliday(day: dayjs.Dayjs): boolean {
  return holidayDates.includes(day.format('YYYY-MM-DD'));
}

function parseReservationDay(value: string): dayjs.Dayjs {
  // Datas do PostgreSQL podem chegar como ISO/UTC. Usar apenas a data evita
  // que 2026-08-24T00:00:00.000Z seja exibido como 23/08 no fuso local.
  return dayjs(value.slice(0, 10)).startOf('day');
}

export function isReserved(day: dayjs.Dayjs, reservations: Reservation[]): boolean {
  return reservations.some((reservation) => {
    const checkIn = parseReservationDay(reservation.checkIn);
    const checkOut = parseReservationDay(reservation.checkOut);
    return !day.isBefore(checkIn, 'day') && !day.isAfter(checkOut, 'day');
  });
}

export function isSelected(day: dayjs.Dayjs, checkIn?: string, checkOut?: string): boolean {
  if (!checkIn || !checkOut) return false;
  const start = dayjs(checkIn).startOf('day');
  const end = dayjs(checkOut).startOf('day');
  if (!start.isValid() || !end.isValid()) return false;
  if (end.isBefore(start)) return false;
  return day.isSame(start) || day.isSame(end) || (day.isAfter(start) && day.isBefore(end));
}

export function getReservationStatus(
  day: dayjs.Dayjs,
  reservations: Reservation[],
  checkIn?: string,
  checkOut?: string,
): ReservationStatus {
  const today = dayjs().startOf('day');
  const isPast = day.isBefore(today, 'day');
  if (isPast) return 'Passado';
  if (isHoliday(day)) return 'Feriado';
  if (isSelected(day, checkIn, checkOut)) return 'Selecionado';
  if (day.isSame(today, 'day')) return 'Hoje';
  if (isReserved(day, reservations)) return 'Reservado';
  if (day.day() === 0 || day.day() === 6) return 'Fim de Semana';
  return 'Livre';
}

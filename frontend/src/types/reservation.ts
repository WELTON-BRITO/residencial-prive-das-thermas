export interface Reservation {
  id: string;
  bookingDate: string;
  customerId?: string | null;
  customer?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  apartmentId: string;
  checkIn: string;
  checkOut: string;
  totalNights: number;
  dailyRate: number;
  rentalAmount: number;
  paidAmount: number;
  dueAmount: number;
  payments?: ReservationPayment[];
  notes?: string;
}

export interface ReservationPayment {
  id: string;
  installment: number;
  amount: number;
  paymentDate?: string | null;
}

export interface CreateReservationDTO {
  customerId?: string;
  customerName?: string;
  apartmentId?: string;
  checkIn: string;
  checkOut: string;
  dailyRate?: number;
  rentalAmount?: number;
  installments?: number[];
}

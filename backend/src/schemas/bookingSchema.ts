import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    apartmentId: z.string().optional(),
    checkIn: z.string().min(1, 'Check-in é obrigatório'),
    checkOut: z.string().min(1, 'Checkout é obrigatório'),
    dailyRate: z.number().optional(),
    rentalAmount: z.number().optional(),
    installments: z.array(z.number()).max(4).optional(),
    notes: z.string().optional(),
  }),
});

export const updateBookingSchema = z.object({
  body: z.object({
    customerId: z.string().optional(),
    customerName: z.string().optional(),
    apartmentId: z.string().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    dailyRate: z.number().optional(),
    rentalAmount: z.number().optional(),
    paidAmount: z.number().optional(),
    installments: z.array(z.number()).max(4).optional(),
    notes: z.string().optional(),
  }),
});

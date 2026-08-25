import prismaClient from '../../prisma/index';
import dayjs from 'dayjs';
import { ResolveBookingCustomerService } from '../client/ResolveBookingCustomerService';

export interface UpdateBookingRequest {
  id: string;
  customerId?: string;
  customerName?: string;
  apartmentId?: string;
  checkIn?: string;
  checkOut?: string;
  dailyRate?: number;
  rentalAmount?: number;
  paidAmount?: number;
  installments?: number[];
  notes?: string;
}

class UpdateBookingService {
  async execute({ id, customerId, customerName, apartmentId, checkIn, checkOut, dailyRate, rentalAmount, paidAmount, installments, notes }: UpdateBookingRequest) {
    const existing = await prismaClient.booking.findUnique({ where: { id } });
    if (!existing) throw new Error('Reserva não encontrada');

    const checkInDate = checkIn ? new Date(checkIn) : existing.checkIn;
    const checkOutDate = checkOut ? new Date(checkOut) : existing.checkOut;

    if (checkOutDate <= checkInDate) throw new Error('Checkout deve ser posterior ao check-in');

    const apartmentIdToUse = apartmentId ?? existing.apartmentId;

    // conflict check ignoring current booking
    const conflicting = await prismaClient.booking.findFirst({
      where: {
        apartmentId: apartmentIdToUse,
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
          { id: { not: id } },
        ],
      },
    });

    if (conflicting) throw new Error('Apartamento já reservado neste período.');

    const customerIdToUse = customerId
      ? await new ResolveBookingCustomerService().execute(customerId)
      : customerName?.trim()
        ? await new ResolveBookingCustomerService().execute(undefined, customerName)
        : existing.customerId;

    const nights = dayjs(checkOutDate).diff(dayjs(checkInDate), 'day');
    const total = rentalAmount ?? (dailyRate ? Number((dailyRate * nights).toFixed(2)) : Number(existing.rentalAmount ?? 0));
    const daily = nights > 0 ? Number((total / nights).toFixed(2)) : 0;
    const paymentValues = installments
      ? installments.slice(0, 4).map((value) => Number(value) || 0)
      : undefined;
    const paid = paymentValues
      ? Math.min(total, paymentValues.reduce((sum, value) => sum + value, 0))
      : Math.min(total, Number(paidAmount ?? existing.paidAmount ?? 0));
    const due = Math.max(Number((total - paid).toFixed(2)), 0);

    const updated = await prismaClient.booking.update({
      where: { id },
      data: {
        customer: {
          connect: { id: customerIdToUse },
        },
        ...(apartmentIdToUse
          ? {
              apartment: {
                connect: { id: apartmentIdToUse },
              },
            }
          : {}),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        totalNights: nights,
        dailyRate: daily,
        rentalAmount: total,
        paidAmount: paid,
        dueAmount: due,
        notes,
        ...(paymentValues
          ? {
              payments: {
                deleteMany: {},
                create: paymentValues
                  .map((amount, index) => ({ amount, installment: index + 1 }))
                  .filter((payment) => payment.amount > 0)
                  .map((payment) => ({
                    installment: payment.installment,
                    amount: payment.amount,
                    paymentDate: new Date(),
                    status: 'PAID' as const,
                  })),
              },
            }
          : {}),
      },
      include: {
        customer: true,
        payments: { orderBy: { installment: 'asc' } },
      },
    });

    return updated;
  }
}

export { UpdateBookingService };

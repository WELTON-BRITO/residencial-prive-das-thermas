import prismaClient from '../../prisma/index';
import dayjs from 'dayjs';
import { ResolveBookingCustomerService } from '../client/ResolveBookingCustomerService';

export interface CreateBookingRequest {
    customerId?: string;
    customerName?: string;
    apartmentId?: string;
    checkIn: string;
    checkOut: string;
    dailyRate?: number;
    rentalAmount?: number;
    installments?: number[];
    notes?: string;
}

class CreateBookingService {
    async execute({
        customerId,
        customerName,
        apartmentId,
        checkIn,
        checkOut,
        dailyRate,
        rentalAmount,
        installments,
        notes,
    }: CreateBookingRequest) {

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
            throw new Error('Datas inválidas.');
        }

        if (checkOutDate <= checkInDate) {
            throw new Error('Checkout deve ser posterior ao check-in.');
        }

        // ==========================
        // Resolve e Valida Cliente (Mova para cá)
        // ==========================

        // Resolve o ID do cliente existente ou cria/busca pelo nome
        const customerIdToUse = await new ResolveBookingCustomerService().execute(
            customerId,
            customerName,
        );

        // Garante que o ID realmente foi retornado e não é nulo/undefined
        if (!customerIdToUse) {
            throw new Error('Não foi possível identificar ou cadastrar o cliente informado.');
        }

        const apartmentIdToUse = apartmentId;

        // ==========================
        // Verifica conflito
        // ==========================

        const conflictingBooking = await prismaClient.booking.findFirst({
            where: {
                apartmentId: apartmentIdToUse,
                AND: [
                    { checkIn: { lt: checkOutDate } },
                    { checkOut: { gt: checkInDate } },
                ],
            },
        });

        if (conflictingBooking) {
            throw new Error('Já existe um agendamento para este período.');
        }

        // ==========================
        // Calcula Diárias
        // ==========================

        const totalNights = dayjs(checkOutDate).diff(dayjs(checkInDate), 'day');

        let totalRental = rentalAmount;
        let daily = dailyRate;

        if (!totalRental && !daily && apartmentIdToUse) {
            const apartment = await prismaClient.apartment.findUnique({
                where: { id: apartmentIdToUse },
            });

            daily = Number(apartment?.defaultDailyRate ?? 0);
        }

        if (!totalRental) {
            totalRental = Number(((daily ?? 0) * totalNights).toFixed(2));
        }

        daily = totalNights > 0 ? Number((totalRental / totalNights).toFixed(2)) : 0;

        // ==========================
        // Pagamentos
        // ==========================

        const paymentValues = (installments ?? [])
            .slice(0, 4)
            .map((value) => Number(value) || 0);

        const paidAmount = paymentValues.reduce((sum, value) => sum + value, 0);

        const dueAmount = Number(
            Math.max(totalRental - paidAmount, 0).toFixed(2),
        );

        // ==========================
        // Cria Reserva
        // ==========================

        const booking = await prismaClient.booking.create({
            data: {
                bookingDate: new Date(),

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
                totalNights,
                dailyRate: daily,
                rentalAmount: totalRental,
                paidAmount,
                dueAmount,
                notes,

                payments: {
                    create: paymentValues
                        .map((amount, index) => ({
                            installment: index + 1,
                            amount,
                        }))
                        .filter((payment) => payment.amount > 0)
                        .map((payment) => ({
                            installment: payment.installment,
                            amount: payment.amount,
                            paymentDate: new Date(),
                            status: 'PAID' as const,
                        })),
                },
            },

            include: {
                customer: true,
                payments: {
                    orderBy: {
                        installment: 'asc',
                    },
                },
            },
        });

        return booking;
    }
}

export { CreateBookingService };
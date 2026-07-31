import prismaClient from '../../prisma/index';

class ListBookingService {
  async execute() {
    const bookings = await prismaClient.booking.findMany({
      orderBy: { checkIn: 'asc' },
      include: {
        customer: true,
        payments: { orderBy: { installment: 'asc' } },
      },
    });
    return bookings;
  }
}

export { ListBookingService };

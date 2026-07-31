import prismaClient from '../../prisma/index';

class DeleteBookingService {
  async execute(id: string) {
    const existing = await prismaClient.booking.findUnique({ where: { id } });
    if (!existing) throw new Error('Reserva não encontrada');

    await prismaClient.booking.delete({ where: { id } });
    return { message: 'Reserva cancelada com sucesso' };
  }
}

export { DeleteBookingService };

import prismaClient from '../../prisma/index';

export class FindClientsService {
  async execute(query: string) {
    const term = query.trim();
    if (!term) return [];

    return prismaClient.customer.findMany({
      where: { name: { contains: term, mode: 'insensitive' } },
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
      take: 10,
    });
  }
}

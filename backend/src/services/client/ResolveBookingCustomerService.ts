import prismaClient from '../../prisma/index';

export function normalizeCustomerName(name: string) {
  return name.trim().replace(/\s+/g, ' ').toUpperCase();
}

export class ResolveBookingCustomerService {
  async execute(customerId?: string, customerName?: string) {
    if (customerId) {
      const customer = await prismaClient.customer.findUnique({
        where: { id: customerId },
        select: { id: true },
      });
      if (!customer) throw new Error('Cliente não encontrado.');
      return customer.id;
    }

    const name = customerName ? normalizeCustomerName(customerName) : '';
    if (!name) throw new Error('Cliente é obrigatório.');

    const existingCustomer = await prismaClient.customer.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      select: { id: true },
    });
    if (existingCustomer) return existingCustomer.id;

    const customer = await prismaClient.customer.create({
      data: { name },
      select: { id: true },
    });
    return customer.id;
  }
}

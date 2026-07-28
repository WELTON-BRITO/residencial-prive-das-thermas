import prismaClient from '../../prisma/index';

export interface CreateExpenseRequest {
  categoryId?: string;
  description: string;
  amount: string;
  dueDate: string;
  paymentDate?: string;
  receiptUrl?: string;
}

class CreateExpenseService {
  async execute({ categoryId, description, amount, dueDate, paymentDate, receiptUrl }: CreateExpenseRequest) {
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new Error('O valor da despesa deve ser maior que zero.');
    }

    const parsedDueDate = new Date(dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) {
      throw new Error('Data de vencimento inválida.');
    }

    const parsedPaymentDate = paymentDate ? new Date(paymentDate) : undefined;
    if (paymentDate && parsedPaymentDate && Number.isNaN(parsedPaymentDate.getTime())) {
      throw new Error('Data de pagamento inválida.');
    }

    const expense = await prismaClient.expense.create({
      data: {
        categoryId: categoryId || null,
        description,
        amount: parsedAmount,
        dueDate: parsedDueDate,
        paymentDate: parsedPaymentDate,
        receiptUrl,
      },
    });

    return expense;
  }
}

export { CreateExpenseService };
import prismaClient from '../../prisma/index';

class ListExpensesService {
  async execute() {
    const expenses = await prismaClient.expense.findMany({
      orderBy: { dueDate: 'desc' },
      include: { category: true },
    });

    return expenses.map((e) => ({
      id: e.id,
      categoria: e.category ? e.category.name : null,
      category: e.category ? e.category.name : null,
      description: e.description,
      descricao: e.description,
      valor: Number(e.amount),
      amount: Number(e.amount),
      dataVencimento: e.dueDate,
      dueDate: e.dueDate,
      paymentDate: e.paymentDate,
      dataPagamento: e.paymentDate,
      status: e.paymentDate ? 'PAGO' : 'PENDENTE',
    }));
  }
}

export { ListExpensesService };

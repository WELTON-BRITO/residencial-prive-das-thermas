import { Request, Response } from 'express';
import { ListExpensesService } from '../../services/expense/ListExpensesService';

class ListExpensesController {
  async handle(req: Request, res: Response) {
    const service = new ListExpensesService();
    try {
      const expenses = await service.execute();
      return res.status(200).json(expenses);
    } catch (error: unknown) {
      if (error instanceof Error) return res.status(500).json({ message: error.message });
      return res.status(500).json({ message: 'Erro ao listar despesas.' });
    }
  }
}

export { ListExpensesController };

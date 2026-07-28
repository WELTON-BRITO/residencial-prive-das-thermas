import { Request, Response } from 'express';
import { CreateExpenseService, CreateExpenseRequest } from '../../services/expense/CreateExpenseService';

class CreateExpenseController {
  async handle(req: Request, res: Response) {
    const expenseData = req.body as CreateExpenseRequest;
    const createExpenseService = new CreateExpenseService();

    try {
      const expense = await createExpenseService.execute(expenseData);
      return res.status(201).json(expense);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Erro ao cadastrar despesa.' });
    }
  }
}

export { CreateExpenseController };
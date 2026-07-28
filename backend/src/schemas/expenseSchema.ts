import { z } from 'zod';

export const createExpenseSchema = z.object({
  body: z.object({
    categoryId: z.string().optional(),
    description: z.string().min(1, 'A descrição é obrigatória.'),
    amount: z.string().min(1, 'O valor é obrigatório.'),
    dueDate: z.string().min(1, 'A data de vencimento é obrigatória.'),
    paymentDate: z.string().optional(),
    receiptUrl: z.string().optional(),
  }),
});

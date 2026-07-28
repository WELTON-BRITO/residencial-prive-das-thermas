import api from '../api/axios';
import type { CreateExpenseFormData, Expense } from '../types/expense';

export async function createExpense(data: CreateExpenseFormData): Promise<Expense> {
  const response = await api.post<Expense>('/despesas', data);
  return response.data;
}

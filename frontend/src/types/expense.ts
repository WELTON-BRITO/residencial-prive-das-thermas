export interface CreateExpenseFormData {
  categoryId?: string;
  description: string;
  amount: string;
  dueDate: string;
  paymentDate?: string;
  receiptUrl?: string;
}

export interface Expense {
  id: string;
  categoryId?: string;
  description: string;
  amount: string;
  dueDate: string;
  paymentDate?: string;
  receiptUrl?: string;
  createdAt: string;
}

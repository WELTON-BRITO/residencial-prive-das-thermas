import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Snackbar,
  TextField,
  Alert,
} from '@mui/material';
import { createExpense } from '../../services/expenseService';
import type { CreateExpenseFormData } from '../../types/expense';

const createExpenseSchema = z.object({
  description: z.string().min(1, 'A descrição é obrigatória.'),
  amount: z.string().min(1, 'O valor é obrigatório.'),
  dueDate: z.string().min(1, 'A data de vencimento é obrigatória.'),
  paymentDate: z.string().optional(),
  receiptUrl: z.string().optional(),
  categoryId: z.string().optional(),
});

type CreateExpenseSchema = z.infer<typeof createExpenseSchema>;

export function CreateExpensePage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
  });

  const onSubmit = async (data: CreateExpenseSchema) => {
    setErrorMessage('');
    try {
      await createExpense(data as CreateExpenseFormData);
      setSuccessMessage('Despesa cadastrada com sucesso');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        setErrorMessage(String((error as { message: unknown }).message));
      } else {
        setErrorMessage('Erro ao cadastrar despesa.');
      }
    }
  };

  const formGridSx = {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(2, minmax(0, 1fr))',
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardHeader title="Cadastrar Despesas" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={formGridSx}>
              <Box>
                <TextField
                  label="Categoria (opcional)"
                  fullWidth
                  {...register('categoryId')}
                  error={Boolean(errors.categoryId)}
                  helperText={errors.categoryId?.message}
                />
              </Box>
              <Box>
                <TextField
                  label="Descrição"
                  fullWidth
                  {...register('description')}
                  error={Boolean(errors.description)}
                  helperText={errors.description?.message}
                />
              </Box>
              <Box>
                <TextField
                  label="Valor"
                  fullWidth
                  {...register('amount')}
                  error={Boolean(errors.amount)}
                  helperText={errors.amount?.message}
                />
              </Box>
              <Box>
                <TextField
                  label="Data de vencimento"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register('dueDate')}
                  error={Boolean(errors.dueDate)}
                  helperText={errors.dueDate?.message}
                />
              </Box>
              <Box>
                <TextField
                  label="Data de pagamento"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  {...register('paymentDate')}
                  error={Boolean(errors.paymentDate)}
                  helperText={errors.paymentDate?.message}
                />
              </Box>
              <Box sx={{ gridColumn: 'span 2' }}>
                <TextField
                  label="URL do comprovante"
                  fullWidth
                  {...register('receiptUrl')}
                  error={Boolean(errors.receiptUrl)}
                  helperText={errors.receiptUrl?.message}
                />
              </Box>
              <Box sx={{ gridColumn: 'span 2' }}>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar open={Boolean(successMessage)} autoHideDuration={6000} onClose={() => setSuccessMessage('')}>
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={Boolean(errorMessage)} autoHideDuration={6000} onClose={() => setErrorMessage('')}>
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

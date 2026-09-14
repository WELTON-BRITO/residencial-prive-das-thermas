import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createExpense } from '../../services/expenseService';
import type { CreateExpenseFormData } from '../../types/expense';

const categoryOptions = ['Luz', 'Água', 'Limpeza', 'IPTU', 'Condomínio', 'Manutenção', 'Internet', 'Segurança'];

const createExpenseSchema = z.object({
  category: z.string().optional(),
  description: z.string().min(1, 'A descrição é obrigatória.'),
  amount: z.string().min(1, 'O valor é obrigatório.'),
  dueDate: z.string().min(1, 'A data de vencimento é obrigatória.'),
  paymentDate: z.string().optional(),
  status: z.enum(['PENDENTE', 'PAGO']),
  receiptUrl: z.string().optional(),
});

type CreateExpenseSchema = z.infer<typeof createExpenseSchema>;

export function CreateExpensePage() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [receiptFileName, setReceiptFileName] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseSchema>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      category: '',
      description: '',
      amount: '',
      dueDate: '',
      paymentDate: '',
      status: 'PENDENTE',
      receiptUrl: '',
    },
  });

  const paymentDate = watch('paymentDate');
  const status = watch('status');

  useEffect(() => {
    if (status === 'PAGO' && (!paymentDate || paymentDate.length === 0)) {
      setValue('paymentDate', new Date().toISOString().slice(0, 10));
    }

    if (status === 'PENDENTE') {
      setValue('paymentDate', '');
    }
  }, [status, paymentDate, setValue]);

  const formGridSx = useMemo(
    () => ({
      display: 'grid',
      gap: 2,
      gridTemplateColumns: {
        xs: '1fr',
        md: 'repeat(2, minmax(0, 1fr))',
      },
    }),
    [],
  );

  const onSubmit = async (data: CreateExpenseSchema) => {
    setErrorMessage('');
    const normalizedPaymentDate = data.status === 'PAGO'
      ? (data.paymentDate?.trim() || new Date().toISOString().slice(0, 10))
      : data.paymentDate?.trim();

    const normalizedDescription = data.category?.trim()
      ? `${data.category.trim()} - ${data.description.trim()}`
      : data.description.trim();

    try {
      await createExpense({
        description: normalizedDescription,
        amount: data.amount,
        dueDate: data.dueDate,
        paymentDate: normalizedPaymentDate || undefined,
        receiptUrl: data.receiptUrl || undefined,
      } as CreateExpenseFormData);
      setSuccessMessage('Despesa cadastrada com sucesso');
      setReceiptFileName('');
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setReceiptFileName('');
      setValue('receiptUrl', '');
      return;
    }

    setReceiptFileName(file.name);
    const previewUrl = URL.createObjectURL(file);
    setValue('receiptUrl', previewUrl);
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardHeader title="Cadastrar Despesas" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Box sx={formGridSx}>
              <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Informações Básicas</Typography>
              </Box>

              <Box>
                <Autocomplete
                  freeSolo
                  options={categoryOptions}
                  value={watch('category') || ''}
                  onChange={(_, newValue) => setValue('category', typeof newValue === 'string' ? newValue : newValue ?? '')}
                  onInputChange={(_, newInputValue) => setValue('category', newInputValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Categoria"
                      placeholder="Luz, Limpeza, IPTU..."
                      error={Boolean(errors.category)}
                      helperText={errors.category?.message}
                    />
                  )}
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
                  type="number"
                  slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
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
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register('dueDate')}
                  error={Boolean(errors.dueDate)}
                  helperText={errors.dueDate?.message}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Informações de Pagamento</Typography>
              </Box>

              <Box>
                <TextField
                  label="Status"
                  select
                  fullWidth
                  value={status}
                  onChange={(event) => {
                    const nextStatus = event.target.value as 'PENDENTE' | 'PAGO';
                    setValue('status', nextStatus);

                    if (nextStatus === 'PENDENTE') {
                      setValue('paymentDate', '');
                      return;
                    }

                    setValue('paymentDate', paymentDate?.trim() || new Date().toISOString().slice(0, 10));
                  }}
                >
                  <MenuItem value="PENDENTE">Pendente</MenuItem>
                  <MenuItem value="PAGO">Pago</MenuItem>
                </TextField>
              </Box>

              <Box>
                <TextField
                  label="Data de pagamento"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  value={paymentDate || ''}
                  onChange={(event) => {
                    const nextDate = event.target.value;
                    setValue('paymentDate', nextDate);

                    if (nextDate) {
                      setValue('status', 'PAGO');
                    }
                  }}
                  error={Boolean(errors.paymentDate)}
                  helperText={errors.paymentDate?.message}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}>
                <Button component="label" variant="outlined" sx={{ mr: 1 }}>
                  Enviar comprovante<input hidden accept="application/pdf,image/*" type="file" onChange={handleFileChange} />
                </Button>
                {receiptFileName ? <Typography variant="body2">Arquivo: {receiptFileName}</Typography> : null}
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', md: 'span 2' }, display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                <Button type="button" variant="outlined" onClick={() => navigate('/financeiro')}>
                  Ver Todas as Despesas
                </Button>
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

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
import { createClient } from '../../services/clientService';
import type { CreateClientFormData } from '../../types/client';

export const createClientSchema = z.object({
  // Campo OBRIGATÓRIO
  name: z.string().trim().min(1, 'O nome é obrigatório.'),

  // Campos OPCIONAIS (Aceitam string vazia, null ou undefined)
  cpf: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^\d{11}$/.test(val), {
      message: 'CPF inválido. Informe apenas os 11 números.',
    }),

  rg: z.string().optional().or(z.literal('')),
  birthDate: z.string().optional().or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  mobile: z.string().optional().or(z.literal('')),

  email: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || z.string().email().safeParse(val).success, {
      message: 'Precisa ser um e-mail válido.',
    }),

  address: z.string().optional().or(z.literal('')),
  number: z.string().optional().or(z.literal('')),
  complement: z.string().optional().or(z.literal('')),
  district: z.string().optional().or(z.literal('')),
  city: z.string().optional().or(z.literal('')),
  state: z.string().optional().or(z.literal('')),
  zipCode: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal('')),
});

type CreateClientSchema = z.infer<typeof createClientSchema>;

export function CreateClientPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
  });

  const onSubmit = async (data: CreateClientSchema) => {
    setErrorMessage('');
    try {
      await createClient(data as CreateClientFormData);
      reset();
      setSuccessMessage('Cliente cadastrado com sucesso');
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        setErrorMessage(String((error as { message: unknown }).message));
      } else {
        setErrorMessage('Erro ao cadastrar cliente.');
      }
    }
  };

  const formGridSx = {
    display: 'grid',
    gap: 2,
    gridTemplateColumns: {
      xs: '1fr',
      md: 'repeat(3, minmax(0, 1fr))',
    },
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Card>
        <CardHeader title="Cadastrar Cliente" />
        <CardContent>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            onChangeCapture={(event) => {
              const target = event.target;
              if (target instanceof HTMLInputElement && target.type === 'date') return;
              if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
                target.value = target.value.toUpperCase();
              }
            }}
            noValidate
          >
            <Box sx={formGridSx}>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 2' } }}>
                <TextField
                  label="Nome"
                  fullWidth
                  {...register('name')}
                  error={Boolean(errors.name)}
                  helperText={errors.name?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="CPF"
                  fullWidth
                  {...register('cpf')}
                  error={Boolean(errors.cpf)}
                  helperText={errors.cpf?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="RG"
                  fullWidth
                  {...register('rg')}
                  error={Boolean(errors.rg)}
                  helperText={errors.rg?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="Data de nascimento"
                  type="date"
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                  {...register('birthDate')}
                  error={Boolean(errors.birthDate)}
                  helperText={errors.birthDate?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="Telefone"
                  fullWidth
                  {...register('phone')}
                  error={Boolean(errors.phone)}
                  helperText={errors.phone?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="Celular"
                  fullWidth
                  {...register('mobile')}
                  error={Boolean(errors.mobile)}
                  helperText={errors.mobile?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="Email"
                  fullWidth
                  {...register('email')}
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="CEP"
                  fullWidth
                  {...register('zipCode')}
                  error={Boolean(errors.zipCode)}
                  helperText={errors.zipCode?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 2' } }}>
                <TextField
                  label="Endereço"
                  fullWidth
                  {...register('address')}
                  error={Boolean(errors.address)}
                  helperText={errors.address?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="Número"
                  fullWidth
                  {...register('number')}
                  error={Boolean(errors.number)}
                  helperText={errors.number?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 2' } }}>
                <TextField
                  label="Complemento"
                  fullWidth
                  {...register('complement')}
                  error={Boolean(errors.complement)}
                  helperText={errors.complement?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="Bairro"
                  fullWidth
                  {...register('district')}
                  error={Boolean(errors.district)}
                  helperText={errors.district?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="Cidade"
                  fullWidth
                  {...register('city')}
                  error={Boolean(errors.city)}
                  helperText={errors.city?.message}
                />
              </Box>
              <Box sx={{ gridColumn: { xs: 'span 3', md: 'span 1' } }}>
                <TextField
                  label="Estado"
                  fullWidth
                  {...register('state')}
                  error={Boolean(errors.state)}
                  helperText={errors.state?.message}
                />
              </Box>
              <Box sx={{ gridColumn: 'span 3' }}>
                <TextField
                  label="Observações"
                  fullWidth
                  multiline
                  minRows={3}
                  {...register('notes')}
                  error={Boolean(errors.notes)}
                  helperText={errors.notes?.message}
                />
              </Box>
              <Box sx={{ gridColumn: 'span 3' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage('')}
      >
        <Alert severity="success" onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={6000}
        onClose={() => setErrorMessage('')}
      >
        <Alert severity="error" onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

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

const createClientSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF inválido. Informe apenas números.'),
  rg: z.string().min(1, 'O RG é obrigatório.'),
  birthDate: z.string().min(1, 'A data de nascimento é obrigatória.'),
  phone: z.string().min(1, 'O telefone é obrigatório.'),
  mobile: z.string().min(1, 'O celular é obrigatório.'),
  email: z.string().email('Precisa ser um e-mail válido.'),
  address: z.string().min(1, 'O endereço é obrigatório.'),
  number: z.string().min(1, 'O número é obrigatório.'),
  complement: z.string().optional(),
  district: z.string().min(1, 'O bairro é obrigatório.'),
  city: z.string().min(1, 'A cidade é obrigatória.'),
  state: z.string().min(1, 'O estado é obrigatório.'),
  zipCode: z.string().min(1, 'O CEP é obrigatório.'),
  notes: z.string().optional(),
});

type CreateClientSchema = z.infer<typeof createClientSchema>;

export function CreateClientPage() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientSchema>({
    resolver: zodResolver(createClientSchema),
  });

  const onSubmit = async (data: CreateClientSchema) => {
    setErrorMessage('');
    try {
      await createClient(data as CreateClientFormData);
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
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
                  InputLabelProps={{ shrink: true }}
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

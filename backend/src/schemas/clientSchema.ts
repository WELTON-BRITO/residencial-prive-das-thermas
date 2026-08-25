import { z } from 'zod';

export const createClientSchema = z.object({
  body: z.object({
    // Campo OBRIGATÓRIO
    name: z.string({ message: 'O nome é obrigatório.' }).trim().min(1, 'O nome é obrigatório.'),

    // Campos OPCIONAIS (Aceitam string vazia, null ou undefined)
    cpf: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((val) => !val || /^\d{11}$/.test(val), {
        message: 'CPF inválido. Informe apenas os 11 números.',
      }),

    rg: z.string().optional().or(z.literal('')),

    birthDate: z
      .string()
      .optional()
      .or(z.literal(''))
      .refine((val) => !val || !Number.isNaN(Date.parse(val)), {
        message: 'Data de nascimento inválida.',
      }),

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
  }),
});

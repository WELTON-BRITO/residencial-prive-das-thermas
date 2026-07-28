import { z } from 'zod';

export const createClientSchema = z.object({
  body: z.object({
    name: z.string({ message: 'O nome é obrigatório.' }).min(1),
    cpf: z.string({ message: 'O CPF é obrigatório.' }).regex(/^\d{11}$/, 'CPF inválido. Informe apenas números.'),
    rg: z.string({ message: 'O RG é obrigatório.' }).min(1),
    birthDate: z.string({ message: 'A data de nascimento é obrigatória.' }).refine(
      (value) => !Number.isNaN(Date.parse(value)),
      { message: 'Data de nascimento inválida.' }
    ),
    phone: z.string({ message: 'O telefone é obrigatório.' }).min(1),
    mobile: z.string({ message: 'O celular é obrigatório.' }).min(1),
    email: z.string().email('Precisa ser um e-mail válido.').optional(),
    address: z.string({ message: 'O endereço é obrigatório.' }).min(1),
    number: z.string({ message: 'O número é obrigatório.' }).min(1),
    complement: z.string().optional(),
    district: z.string({ message: 'O bairro é obrigatório.' }).min(1),
    city: z.string({ message: 'A cidade é obrigatória.' }).min(1),
    state: z.string({ message: 'O estado é obrigatório.' }).min(1),
    zipCode: z.string({ message: 'O CEP é obrigatório.' }).min(1),
    notes: z.string().optional(),
  }),
});

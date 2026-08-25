import prismaClient from '../../prisma/index';

export interface CreateClientRequest {
  name: string;
  cpf?: string;
  rg?: string;
  birthDate?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
}

function isValidCpf(cpf: string) {
  return /^\d{11}$/.test(cpf);
}

class CreateClientService {
  async execute({
    name,
    cpf,
    rg,
    birthDate,
    phone,
    mobile,
    email,
    address,
    number,
    complement,
    district,
    city,
    state,
    zipCode,
    notes,
  }: CreateClientRequest) {
    const normalizedCpf = cpf?.trim() || undefined;
    const normalizedEmail = email?.trim() || undefined;
    const normalizedBirthDate = birthDate?.trim() || undefined;

    if (normalizedCpf && !isValidCpf(normalizedCpf)) {
      throw new Error('CPF inválido. Informe apenas números.');
    }

    const existingClientByCpf = normalizedCpf
      ? await prismaClient.customer.findUnique({ where: { taxId: normalizedCpf } })
      : null;

    if (existingClientByCpf) {
      throw new Error('Já existe um cliente cadastrado com este CPF.');
    }

    if (normalizedEmail) {
      const existingClientByEmail = await prismaClient.customer.findFirst({
        where: { email: normalizedEmail },
      });

      if (existingClientByEmail) {
        throw new Error('Já existe um cliente cadastrado com este e-mail.');
      }
    }

    const birthDateValue = normalizedBirthDate ? new Date(normalizedBirthDate) : undefined;
    if (birthDateValue && Number.isNaN(birthDateValue.getTime())) {
      throw new Error('Data de nascimento inválida 3.');
    }

    const client = await prismaClient.customer.create({
      data: {
        name,
        taxId: normalizedCpf,
        rg: rg?.trim() || undefined,
        birthDate: birthDateValue,
        phone: phone?.trim() || undefined,
        mobile: mobile?.trim() || undefined,
        email: normalizedEmail,
        address: address?.trim() || undefined,
        addressNumber: number?.trim() || undefined,
        complement: complement?.trim() || undefined,
        district: district?.trim() || undefined,
        city: city?.trim() || undefined,
        state: state?.trim() || undefined,
        zipCode: zipCode?.trim() || undefined,
        notes: notes?.trim() || undefined,
      },
    });

    return client;
  }
}

export { CreateClientService };

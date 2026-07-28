import prismaClient from '../../prisma/index';

export interface CreateClientRequest {
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
  phone: string;
  mobile: string;
  email?: string;
  address: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
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
    if (!isValidCpf(cpf)) {
      throw new Error('CPF inválido. Informe apenas números.');
    }

    const existingClientByCpf = await prismaClient.customer.findUnique({
      where: { taxId: cpf },
    });

    if (existingClientByCpf) {
      throw new Error('Já existe um cliente cadastrado com este CPF.');
    }

    if (email) {
      const existingClientByEmail = await prismaClient.customer.findFirst({
        where: { email },
      });

      if (existingClientByEmail) {
        throw new Error('Já existe um cliente cadastrado com este e-mail.');
      }
    }

    const birthDateValue = new Date(birthDate);
    if (Number.isNaN(birthDateValue.getTime())) {
      throw new Error('Data de nascimento inválida.');
    }

    const client = await prismaClient.customer.create({
      data: {
        name,
        taxId: cpf,
        rg,
        birthDate: birthDateValue,
        phone,
        mobile,
        email,
        address,
        addressNumber: number,
        complement,
        district,
        city,
        state,
        zipCode,
        notes,
      },
    });

    return client;
  }
}

export { CreateClientService };

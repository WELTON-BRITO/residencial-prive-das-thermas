import prismaClient from '../../prisma/index';
import { hash } from 'bcryptjs';

interface CreateUserProps {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    async execute({ name, email, password }: CreateUserProps) {
        console.log('Executando o serviço de criação de usuário...');

        const userExists = await prismaClient.user.findUnique({ where: { email } });

        if (userExists) {
            throw new Error('Usuário já existe!');
        }

        const passwordHash = await hash(password, 8);

        const user = await prismaClient.user.create({
            data: {
                name: name,
                email: email,
                passwordHash: passwordHash,
            }
        });

        return { message: user.name + ' criado com sucesso!' };
    }
}   

export { CreateUserService };

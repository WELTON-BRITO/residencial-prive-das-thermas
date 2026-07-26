import { compare } from 'bcryptjs';
import prisma from '../../prisma/index'
import { sign } from 'jsonwebtoken';

interface AuthUserServiceProps {
    email: string;
    password: string;
}

class AuthUserService {
    async execute({ email, password }: AuthUserServiceProps) {

        const userExists = await prisma.user.findFirst({
             where: { email } 
            });

            if (!userExists) {
                throw new Error('E-mail ou senha é obrigatório.');
            }

        const passwordMatch = await compare(password, userExists.passwordHash);

        if (!passwordMatch) {
            throw new Error('E-mail ou senha é obrigatório.');
        }

        //GERAR TOKEN JWT AQUI, CASO O USUÁRIO EXISTA E A SENHA ESTEJA CORRETA

        const token = sign(
            { 
            name: userExists.name, 
            email: userExists.email,                            
            },  process.env.JWT_SECRET as string, {
            subject: userExists.id,
            expiresIn: '30d',    
            })

        return { 
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
            role: userExists.role,
            token: token,
         };
    }
}

export { AuthUserService };
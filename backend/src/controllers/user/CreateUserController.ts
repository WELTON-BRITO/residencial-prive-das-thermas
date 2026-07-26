import { Request, Response} from 'express';
import { CreateUserService } from '../../services/user/CreateUserService';

class CreateUserController {
    async handle(req: Request, res: Response) {

        const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
        console.log('Dados recebidos no controller:', { name, email, password });
        const createUserService = new CreateUserService();
        const user = await createUserService.execute({ 
            name: name ?? '', 
            email: email ?? '', 
            password: password ?? '' });

        res.json({ message: user.message });
    }
}

export { CreateUserController };
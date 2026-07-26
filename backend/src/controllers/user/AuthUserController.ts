import { Request, Response} from 'express'
import { AuthUserService } from '../../services/user/AuthUserService';

class AuthUserController {
   async handle(req: Request, res: Response) {
    const { email, password } = req.body as { email?: string; password?: string };  
    console.log('Dados recebidos no controller:', { email, password });

    const authUserService = new AuthUserService();
    const result = await authUserService.execute({
      email: email ?? '',
      password: password ?? '',
    });

    res.json(result);
    }
}

export { AuthUserController };
import { Request, Response } from 'express';
import { DetailUserService } from '../../services/user/DetailUserService';  

class DetailUserController {
    async handle(req: Request, res: Response) {
        
        const user_id = req.user_id; // Obtém o user_id do objeto Request
        const detailUser = new DetailUserService();          
        const user = await detailUser.execute(user_id); // Passa o user_id para o serviço

        return res.json(user);
    }
}

export { DetailUserController };
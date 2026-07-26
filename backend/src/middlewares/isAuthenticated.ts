import { NextFunction, Request, Response } from 'express';  
import { verify }from 'jsonwebtoken';

interface Payload {
    sub: string;
}

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
    
    const authToken = req.headers.authorization;   
    console.log('Token recebido no middleware isAuthenticated:', authToken);
    if(!authToken) {
        return res.status(401).json({ message: 'Token ausente.' });
    }

    const [, token] = authToken.split(' '); 

    try {
        const { sub } = verify(token, process.env.JWT_SECRET as string) as Payload;
        req.user_id = sub;
        console.log('Token verificado com sucesso. Sub:', sub);
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Token inválido!!!' });
    }
    
}
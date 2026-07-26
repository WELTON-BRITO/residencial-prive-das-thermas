import { NextFunction, Request, Response } from 'express';
import { ZodType, ZodError } from 'zod';

export const validateSchema =
(schema: ZodType) => async (req: Request, res: Response, next: NextFunction) => {

    try {
        await schema.parseAsync({ 
            body: req.body,
            query: req.query,
            params: req.params,
        });
        return next();
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ 
                error: error.issues[0]?.message || "Dados inválidos", 
                details: error.issues.map((issue) => ({
                    campo: issue.path.slice(1).join('.'),
                    mensagem: issue.message
                }))
            });
        }  
        return res.status(500).json({ message: 'Erro de validação desconhecido.' }); 
    }
}

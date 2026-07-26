import { z } from 'zod'

export const createUserSchema = z.object({
    body: z.object({
        name: z.string({
            message: 'O nome é obrigatório',
        }).max(100),
        email: z.string({
            message: 'Precisa ser um email válido',
        }),
        password: z.string({
            message: 'A senha deve ter 6 caracteres',
        }).min(6),
    })
})

export const authUserSchema = z.object({
    body: z.object({        
        email: z.string({message: 'Precisa ser um email válido'}),
        password: z
        .string({message: 'A senha é obrigatória'})
        .min(1, {message: 'A senha é obrigatória'}),
    })
})
import { Router, Request, Response } from 'express';
import { CreateUserController } from './controllers/user/CreateUserController';
import { validateSchema } from './middlewares/validadeSchema';
import { createUserSchema, authUserSchema } from './schemas/userSchema';
import { AuthUserController } from './controllers/user/AuthUserController';
import { DetailUserController } from './controllers/user/DetailUserController';
import { isAuthenticated } from './middlewares/isAuthenticated';

const router = Router();

router.post(
    '/users', 
    validateSchema(createUserSchema), 
    new CreateUserController().handle
);

router.post(
    '/auth/login', 
    validateSchema(authUserSchema), 
    new AuthUserController().handle 
);

router.get(
    '/auth/me',
    isAuthenticated,
    new DetailUserController().handle
);

export { router };
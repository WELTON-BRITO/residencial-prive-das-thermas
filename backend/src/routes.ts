import { Router, Request, Response } from 'express';
import { CreateUserController } from './controllers/user/CreateUserController';
import { validateSchema } from './middlewares/validadeSchema';
import { createUserSchema, authUserSchema } from './schemas/userSchema';
import { CreateClientController } from './controllers/client/CreateClientController';
import { FindClientsController } from './controllers/client/FindClientsController';
import { createClientSchema } from './schemas/clientSchema';
import { CreateExpenseController } from './controllers/expense/CreateExpenseController';
import { createExpenseSchema } from './schemas/expenseSchema';
import { CreateBookingController } from './controllers/booking/CreateBookingController';
import { ListBookingController } from './controllers/booking/ListBookingController';
import { UpdateBookingController } from './controllers/booking/UpdateBookingController';
import { DeleteBookingController } from './controllers/booking/DeleteBookingController';
import { createBookingSchema, updateBookingSchema } from './schemas/bookingSchema';
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

router.post(
    '/clientes',
    isAuthenticated,
    validateSchema(createClientSchema),
    new CreateClientController().handle
);

router.get(
    '/clientes',
    isAuthenticated,
    new FindClientsController().handle
);

router.post(
    '/despesas',
    isAuthenticated,
    validateSchema(createExpenseSchema),
    new CreateExpenseController().handle
);

router.get(
    '/agendamentos',
    isAuthenticated,
    new ListBookingController().handle
);

router.post(
    '/agendamentos',
    isAuthenticated,
    validateSchema(createBookingSchema),
    new CreateBookingController().handle
);

router.put(
    '/agendamentos/:id',
    isAuthenticated,
    validateSchema(updateBookingSchema),
    new UpdateBookingController().handle
);

router.delete(
    '/agendamentos/:id',
    isAuthenticated,
    new DeleteBookingController().handle
);

router.get(
    '/auth/me',
    isAuthenticated,
    new DetailUserController().handle
);

export { router };

import { Router } from 'express';
import { usersController } from '../controllers/users-controller';
import { userDataValidation } from '../validations/data-validation';
import { authValidationMiddleware } from '../middlewares/auth-validation-middleware';


const usersRouter = Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.post('/', authValidationMiddleware, userDataValidation, usersController.createUser);
usersRouter.delete('/:id', authValidationMiddleware, usersController.deleteUser);

export { usersRouter };
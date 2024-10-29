import { Router } from 'express';
import { usersController } from './users.controller';
import { userDataValidation } from '../common/validation/dataValidation';
import { authBaseGuard } from '../common/middlewares/guards/authBase.guard';


const usersRouter = Router();

usersRouter.get('/', usersController.getUsers);
usersRouter.post('/', authBaseGuard, userDataValidation, usersController.createUser);
usersRouter.delete('/:id', authBaseGuard, usersController.deleteUser);

export { usersRouter };
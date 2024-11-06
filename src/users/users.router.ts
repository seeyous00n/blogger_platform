import { Router } from 'express';
import { usersController } from './users.controller';
import { userDataValidation } from '../common/validation/data.validation';
import { authBaseGuard } from '../common/middlewares/guards/authBase.guard';
import { queryStringPaginationValidation } from '../common/validation/queryStringPagination.validation';

const usersRouter = Router();

usersRouter.get('/', queryStringPaginationValidation, usersController.getUsers);
usersRouter.post('/', authBaseGuard, userDataValidation, usersController.createUser);
usersRouter.delete('/:id', authBaseGuard, usersController.deleteUser);

export { usersRouter };
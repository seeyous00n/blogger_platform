import { Router } from 'express';
import { userDataValidation } from '../common/validation/data.validation';
import { authBaseGuard } from '../common/middlewares/guards/authBase.guard';
import { queryStringPaginationUserValidation } from '../common/validation/queryStringPagination.validation';
import { usersController } from "../composition-root";

const usersRouter = Router();

usersRouter.get('/', authBaseGuard, queryStringPaginationUserValidation, usersController.getUsers);
usersRouter.post('/', authBaseGuard, userDataValidation, usersController.createUser);
usersRouter.delete('/:id', authBaseGuard, usersController.deleteUser);

export { usersRouter };
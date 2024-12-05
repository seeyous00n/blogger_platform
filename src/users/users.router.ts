import { Router } from 'express';
import { userDataValidation } from '../common/validation/data.validation';
import { authBaseGuard } from '../common/middlewares/guards/authBase.guard';
import { queryStringPaginationUserValidation } from '../common/validation/queryStringPagination.validation';
import { container } from "../composition-root";
import { UsersController } from "./users.controller";

const usersController = container.resolve(UsersController);

const usersRouter = Router();

usersRouter.get('/', authBaseGuard, queryStringPaginationUserValidation, usersController.getUsers);
usersRouter.post('/', authBaseGuard, userDataValidation, usersController.createUser);
usersRouter.delete('/:id', authBaseGuard, usersController.deleteUser);

export { usersRouter };
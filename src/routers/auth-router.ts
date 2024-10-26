import { Router } from 'express';
import { authController } from '../controllers/auth-controller';
import { authValidationMiddleware } from '../middlewares/auth-validation-middleware';

const authRouter = Router();

authRouter.post('/', authController.authUser);

export { authRouter };
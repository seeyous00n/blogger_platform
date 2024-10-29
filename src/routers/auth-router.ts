import { Router } from 'express';
import { authController } from '../controllers/auth-controller';
import { authBearerValidationMiddleware } from '../middlewares/auth-bearer-validation-middleware';
import { authDataValidation } from '../validations/data-validation';

const authRouter = Router();

authRouter.post('/login', authController.authUser);
authRouter.get('/me', authBearerValidationMiddleware, authDataValidation, authController.getMe);

export { authRouter };
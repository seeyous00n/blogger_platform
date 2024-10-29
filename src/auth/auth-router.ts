import { Router } from 'express';
import { authController } from './auth-controller';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import { authDataValidation } from '../common/validation/dataValidation';

const authRouter = Router();

authRouter.post('/login', authController.authUser);
authRouter.get('/me', authJwtGuard, authDataValidation, authController.getMe);

export { authRouter };
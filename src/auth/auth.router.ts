import { Router } from 'express';
import { authController } from './auth.controller';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import {
  authDataValidation,
  confirmationCodeValidator,
  emailValidator,
  registrationDataValidation,
} from '../common/validation/data.validation';

const authRouter = Router();

authRouter.post('/login', authController.authLoginUser);
authRouter.get('/me', authJwtGuard, authDataValidation, authController.getMe);
authRouter.post('/registration', registrationDataValidation, authController.registration);
authRouter.post('/registration-confirmation', confirmationCodeValidator, authController.confirmationEmail);
authRouter.post('/registration-email-resending', emailValidator, authController.resendingEmail);

export { authRouter };
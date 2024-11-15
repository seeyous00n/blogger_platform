import { Router } from 'express';
import { authController } from './auth.controller';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import {
  authDataValidation,
  confirmationCodeValidator,
  emailValidator,
  registrationDataValidation,
} from '../common/validation/data.validation';
import { authJwtRefreshGuard } from "../common/middlewares/guards/authJwtRefresh.guard";
import { countMiddleware } from "../common/middlewares/session/countMiddleware";

const authRouter = Router();

authRouter.post('/login', countMiddleware, authDataValidation, authController.authLoginUser);
authRouter.get('/me', authJwtGuard, authController.getMe);
authRouter.post('/registration', countMiddleware, registrationDataValidation, authController.registration);
authRouter.post('/registration-confirmation', countMiddleware, confirmationCodeValidator, authController.confirmationEmail);
authRouter.post('/registration-email-resending', countMiddleware, emailValidator, authController.resendingEmail);
authRouter.post('/refresh-token', authJwtRefreshGuard, authController.refreshToken);
authRouter.post('/logout', authJwtRefreshGuard, authController.logout);

export { authRouter };
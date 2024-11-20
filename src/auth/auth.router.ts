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
import { rateLimitMiddleware } from "../common/middlewares/rateLimit/rateLimitMiddleware";

const authRouter = Router();

authRouter.post('/login', rateLimitMiddleware, authDataValidation, authController.authLoginUser);
authRouter.get('/me', authJwtGuard, authController.getMe);
authRouter.post('/registration', rateLimitMiddleware, registrationDataValidation, authController.registration);
authRouter.post('/registration-confirmation', rateLimitMiddleware, confirmationCodeValidator, authController.confirmationEmail);
authRouter.post('/registration-email-resending', rateLimitMiddleware, emailValidator, authController.resendingEmail);
authRouter.post('/refresh-token', authJwtRefreshGuard, authController.refreshToken);
authRouter.post('/logout', authJwtRefreshGuard, authController.logout);

export { authRouter };
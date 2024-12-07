import { Router } from 'express';
import { authJwtGuard } from '../common/middlewares/guards/authJwt.guard';
import {
  authDataValidation,
  confirmationCodeValidator,
  emailValidator, newPasswordValidator,
  registrationDataValidation,
} from '../common/validation/data.validation';
import { authJwtRefreshGuard } from "../common/middlewares/guards/authJwtRefresh.guard";
import { rateLimitMiddleware } from "../common/middlewares/rateLimit/rateLimitMiddleware";
import { inputValidation } from "../common/validation/input.validation";
import { container } from "../composition-root";
import { AuthController } from "./auth.controller";

const authController = container.resolve(AuthController);

const authRouter = Router();

authRouter.post('/login', rateLimitMiddleware, authDataValidation, authController.authLoginUser);
authRouter.get('/me', authJwtGuard, authController.getMe);
authRouter.post('/registration', rateLimitMiddleware, registrationDataValidation, authController.registration);
authRouter.post('/registration-confirmation', rateLimitMiddleware, confirmationCodeValidator, inputValidation, authController.confirmationEmail);
authRouter.post('/registration-email-resending', rateLimitMiddleware, emailValidator, inputValidation, authController.resendingEmail);
authRouter.post('/refresh-token', authJwtRefreshGuard, authController.refreshToken);
authRouter.post('/logout', authJwtRefreshGuard, authController.logout);
authRouter.post('/password-recovery', rateLimitMiddleware, emailValidator, inputValidation, authController.passwordRecovery);
authRouter.post('/new-password', rateLimitMiddleware, newPasswordValidator, inputValidation, authController.newPassword);

export { authRouter };
import { Response } from 'express';
import { authService } from './auth.service';
import { RequestWithBody } from '../common/types/types';
import { AuthType, TokenType } from './types/auth.type';
import { sendError } from '../common/errorHandler';
import { HTTP_STATUS_CODE } from '../common/settings';
import { tokenService } from '../common/services/token.service';
import { usersQueryRepository } from '../users/usersQuery.repository';
import { userService } from '../users/user.service';
import { UserCreateModel } from '../users/models/userCreate.model';

class AuthController {
  authLoginUser = async (req: RequestWithBody<AuthType>, res: Response) => {
    try {
      const userId = await authService.checkCredentials(req.body);
      const token = await tokenService.generateToken(userId);

      res.status(HTTP_STATUS_CODE.OK_200).json({ 'accessToken': token });
    } catch (e: any) {
      sendError(e, res);
    }
  };

  getMe = async (req: RequestWithBody<TokenType>, res: Response) => {
    try {
      const result = await usersQueryRepository.findById(req.body.userId, true);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e) {
      res.status(500).json();
    }
  };

  registration = async (req: RequestWithBody<UserCreateModel>, res: Response) => {
    try {
      const result = await userService.createUser(req.body, false);
      const user = await userService.isExistsUser(result.insertedId.toString());
      authService.registration(req.body.email, user.emailConfirmation.confirmationCode);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e) {
      sendError(e, res);
    }
  };

  confirmationEmail = async (req: RequestWithBody<{ code: string }>, res: Response) => {
    try {
      await authService.confirmation(req.body.code);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e) {
      sendError(e, res);
    }
  };

  resendingEmail = async (req: RequestWithBody<{ email: string }>, res: Response) => {
    try {
      await authService.resending(req.body.email)
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e) {
      sendError(e, res);
    }
  };
}

export const authController = new AuthController();
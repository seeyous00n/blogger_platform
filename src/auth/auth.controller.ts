import { Response, Request } from 'express';
import { authService } from './auth.service';
import { RequestWithBody } from '../common/types/types';
import { AuthType, DataInTokenType } from './types/auth.type';
import { sendError } from '../common/errorHandler';
import { HTTP_STATUS_CODE } from '../common/settings';
import { usersQueryRepository } from '../users/usersQuery.repository';
import { userService } from '../users/user.service';
import { UserCreateModel } from '../users/models/userCreate.model';
import { TOKENS_NAME } from "./types/token.type";
import { tokenService } from "../common/services/token.service";

class AuthController {
  authLoginUser = async (req: RequestWithBody<AuthType>, res: Response) => {
    try {
      const userId = await authService.checkCredentials(req.body);
      const { accessToken, refreshToken } = await authService.createTokens(userId);

      res.cookie(TOKENS_NAME.REFRESH_TOKEN, refreshToken, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 });
      res.status(HTTP_STATUS_CODE.OK_200).json({ [TOKENS_NAME.ACCESS_TOKEN]: accessToken });
    } catch (error) {
      sendError(error, res);
    }
  };

  getMe = async (req: RequestWithBody<DataInTokenType>, res: Response) => {
    try {
      const result = await usersQueryRepository.findById(req.body.userId, true);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  registration = async (req: RequestWithBody<UserCreateModel>, res: Response) => {
    try {
      //TODO это норм практика? передавать флаг
      const result = await userService.createUser(req.body, false);
      const user = await userService.getUserById(result.insertedId.toString());
      await authService.registration(req.body.email, user.emailConfirmation.confirmationCode);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  confirmationEmail = async (req: RequestWithBody<{ code: string }>, res: Response) => {
    try {
      await authService.confirmation(req.body.code);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  resendingEmail = async (req: RequestWithBody<{ email: string }>, res: Response) => {
    try {
      await authService.resending(req.body.email);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  refreshToken = async (req: RequestWithBody<DataInTokenType>, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const userId = req.body.userId;
      const { accessToken, refreshToken } = await authService.getAccessAndRefreshTokens({ userId: userId }, token);

      res.cookie(TOKENS_NAME.REFRESH_TOKEN, refreshToken, { httpOnly: true, secure: true, maxAge: 1000 * 60 * 60 * 24 });
      res.status(HTTP_STATUS_CODE.OK_200).json({ [TOKENS_NAME.ACCESS_TOKEN]: accessToken });
    } catch (error) {
      sendError(error, res);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const oldTokenIat = tokenService.getIatToken(token);
      res.clearCookie(TOKENS_NAME.REFRESH_TOKEN);
      await authService.deleteToken(oldTokenIat);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}

export const authController = new AuthController();
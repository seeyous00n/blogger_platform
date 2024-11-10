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
import { cookieOptions } from "../common/utils/cookieOptions.util";

class AuthController {
  authLoginUser = async (req: RequestWithBody<AuthType>, res: Response) => {
    try {
      const userId = await authService.checkCredentials(req.body);
      const { accessToken, refreshToken } = await authService.createTokens(userId);

      res.cookie(TOKENS_NAME.REFRESH_TOKEN, refreshToken, cookieOptions.getOptionsForRefreshToken());
      res.status(HTTP_STATUS_CODE.OK_200).json({ [TOKENS_NAME.ACCESS_TOKEN]: accessToken });
    } catch (error) {
      sendError(error, res);
    }
  };

  getMe = async (req: RequestWithBody<DataInTokenType>, res: Response) => {
    try {
      const result = await usersQueryRepository.findAuthUserById(req.body.userId);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  registration = async (req: RequestWithBody<UserCreateModel>, res: Response) => {
    try {
      const result = await userService.createUser(req.body);
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
      const { accessToken, refreshToken } = await authService.getNewPairOfTokens(token);

      res.cookie(TOKENS_NAME.REFRESH_TOKEN, refreshToken, cookieOptions.getOptionsForRefreshToken());
      res.status(HTTP_STATUS_CODE.OK_200).json({ [TOKENS_NAME.ACCESS_TOKEN]: accessToken });
    } catch (error) {
      sendError(error, res);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const { userId, iat } = tokenService.getDataToken(token);
      await authService.deleteToken(iat, userId);

      res.clearCookie(TOKENS_NAME.REFRESH_TOKEN);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}

export const authController = new AuthController();
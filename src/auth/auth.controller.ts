import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RequestWithBody } from '../common/types/types';
import { AuthType, DataInAccessTokenType, InputNewPasswordType, InputRecoveryType } from './types/auth.type';
import { sendError } from '../common/errorHandler';
import { HTTP_STATUS_CODE } from '../common/settings';
import { UserCreateModel } from '../users/models/userCreate.model';
import { TOKENS_NAME } from "./types/token.type";
import { TokenService } from "../common/services/token.service";
import { UserService } from "../users/user.service";
import { UsersQueryRepository } from "../users/usersQuery.repository";
import { cookieOptionsForRefreshToken } from "../common/utils/cookieOptions.util";

export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private usersQueryRepository: UsersQueryRepository,
    private tokenService: TokenService) {
  }

  authLoginUser = async (req: RequestWithBody<AuthType>, res: Response) => {
    try {
      const userId = await this.authService.checkCredentials(req.body);
      const data = { userId, ip: req.ip || '', title: req.headers['user-agent'] || '' };
      const { accessToken, refreshToken } = await this.authService.createTokens(data);

      res.cookie(TOKENS_NAME.REFRESH_TOKEN, refreshToken, cookieOptionsForRefreshToken());
      res.status(HTTP_STATUS_CODE.OK_200).json({ [TOKENS_NAME.ACCESS_TOKEN]: accessToken });
    } catch (error) {
      sendError(error, res);
    }
  };

  getMe = async (req: RequestWithBody<DataInAccessTokenType>, res: Response) => {
    try {
      const result = await this.usersQueryRepository.findAuthUserById(req.user.userId);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  registration = async (req: RequestWithBody<UserCreateModel>, res: Response) => {
    try {
      const result = await this.userService.createUser(req.body);
      await this.authService.registration(req.body.email, result.emailConfirmation.confirmationCode);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  confirmationEmail = async (req: RequestWithBody<{ code: string }>, res: Response) => {
    try {
      await this.authService.confirmation(req.body.code);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  resendingEmail = async (req: RequestWithBody<{ email: string }>, res: Response) => {
    try {
      await this.authService.resending(req.body.email);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  refreshToken = async (req: RequestWithBody<DataInAccessTokenType>, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const { accessToken, refreshToken } = await this.authService.refreshToken(token);

      res.cookie(TOKENS_NAME.REFRESH_TOKEN, refreshToken, cookieOptionsForRefreshToken());
      res.status(HTTP_STATUS_CODE.OK_200).json({ [TOKENS_NAME.ACCESS_TOKEN]: accessToken });
    } catch (error) {
      sendError(error, res);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const { deviceId, iat } = this.tokenService.getDataToken(token);
      await this.authService.deleteToken(iat, deviceId);

      res.clearCookie(TOKENS_NAME.REFRESH_TOKEN);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  passwordRecovery = async (req: RequestWithBody<InputRecoveryType>, res: Response) => {
    try {
      await this.authService.recovery(req.body.email);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  newPassword = async (req: RequestWithBody<InputNewPasswordType>, res: Response) => {
    try {
      await this.authService.newPassword(req.body.recoveryCode, req.body.newPassword);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}
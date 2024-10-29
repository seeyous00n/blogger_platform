import { Response } from 'express';
import { authService } from '../services/auth-servise';
import { RequestWithBody } from '../types/types';
import { AuthType, TokenType } from '../types/auth-type';
import { sendError } from '../utils/error-handler';
import { HTTP_STATUS_CODE } from '../settings';
import { tokenService } from '../services/token-service';
import { usersQueryRepository } from '../repositories/users-query-repository';

class AuthController {
  authUser = async (req: RequestWithBody<AuthType>, res: Response) => {
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
}

export const authController = new AuthController();
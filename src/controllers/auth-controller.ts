import { Response } from 'express';
import { authService } from '../services/auth-servise';
import { RequestWithBody } from '../types/types';
import { AuthType } from '../types/auth-type';
import { sendError } from '../utils/error-handler';
import { HTTP_STATUS_CODE } from '../settings';

class AuthController {
  authUser = async (req: RequestWithBody<AuthType>, res: Response) => {
    try {
      await authService.checkCredentials(req.body);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };
}

export const authController = new AuthController();
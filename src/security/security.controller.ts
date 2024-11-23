import { Request, Response } from "express";
import { securityQueryRepository } from "./securityQuery.repository";
import { HTTP_STATUS_CODE } from "../common/settings";
import { securityService } from "./security.service";
import { sendError } from "../common/errorHandler";
import { tokenService } from "../common/services/token.service";

class SecurityController {
  getDevices = async (req: Request, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const { userId } = tokenService.getDataToken(token);
      const result = await securityQueryRepository.getDevises(userId);

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteDevice = async (req: Request, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const deviceId = req.params.id;
      await securityService.deleteDevice(token, deviceId);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteDevices = async (req: Request, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      await securityService.deleteDevices(token);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}

export const securityController = new SecurityController();
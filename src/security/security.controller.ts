import { Request, Response } from "express";
import { SecurityQueryRepository } from "./securityQuery.repository";
import { HTTP_STATUS_CODE } from "../common/settings";
import { SecurityService } from "./security.service";
import { sendError } from "../common/errorHandler";
import { RequestWithParams } from "../common/types/types";

export class SecurityController {
  constructor(
    private securityService: SecurityService,
    private securityQueryRepository: SecurityQueryRepository) {
  }

  getDevices = async (req: Request, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const result = await this.securityQueryRepository.getDevises(token);

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteDevice = async (req: RequestWithParams<{ id: string }>, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      const deviceId = req.params.id;
      await this.securityService.deleteDevice(token, deviceId);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteDevices = async (req: Request, res: Response) => {
    try {
      const token: string = req.cookies.refreshToken;
      await this.securityService.deleteDevices(token);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}
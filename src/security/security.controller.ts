import { NextFunction, Request, Response } from "express";
import { SecurityQueryRepository } from "./securityQuery.repository";
import { HTTP_STATUS_CODE } from "../common/settings";
import { SecurityService } from "./security.service";
import { RequestWithParams } from "../common/types/types";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityController {
  constructor(
    @inject(SecurityService) private securityService: SecurityService,
    @inject(SecurityQueryRepository) private securityQueryRepository: SecurityQueryRepository) {
  }

  getDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = req.cookies.refreshToken;
      const result = await this.securityQueryRepository.getDevises(token);

      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      next(error);
    }
  };

  deleteDevice = async (req: RequestWithParams<{ id: string }>, res: Response, next: NextFunction) => {
    try {
      const token: string = req.cookies.refreshToken;
      const deviceId = req.params.id;
      await this.securityService.deleteDevice(token, deviceId);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };

  deleteDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = req.cookies.refreshToken;
      await this.securityService.deleteDevices(token);

      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      next(error);
    }
  };
}
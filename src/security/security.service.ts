import { TokenService } from "../common/services/token.service";
import { CustomError, TYPE_ERROR } from "../common/errorHandler";
import { SecurityRepository } from "./security.repository";
import { DeviceAndUserType } from "./types/security.types";
import { SessionType } from "../auth/types/token.type";
import { WithId } from "mongodb";

export class SecurityService {
  constructor(
    private securityRepository: SecurityRepository,
    private tokenService: TokenService) {
  }

  async deleteDevice(token: string, deviceId: string): Promise<void> {
    const { userId } = this.tokenService.getDataToken(token);
    const device = await this.checkOwnerDevice({ deviceId: deviceId, userId: userId });

    await this.securityRepository.deleteById(device._id.toString());
  }

  async deleteDevices(token: string): Promise<void> {
    const { userId, deviceId } = this.tokenService.getDataToken(token);
    await this.securityRepository.deleteAllExceptCurrent({ deviceId, userId });
  }

  async checkOwnerDevice(data: DeviceAndUserType): Promise<WithId<SessionType>> {
    const isDevice = await this.securityRepository.findByDeviceId(data.deviceId);
    if (!isDevice) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const device = await this.securityRepository.findByDeviceIdAndUserId(data);
    if (!device) {
      throw new CustomError(TYPE_ERROR.FORBIDDEN_ERROR);
    }

    return device;
  }
}
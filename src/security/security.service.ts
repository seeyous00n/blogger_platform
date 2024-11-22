import { tokenService } from "../common/services/token.service";
import { CustomError, TYPE_ERROR } from "../common/errorHandler";
import { securityRepository } from "./security.repository";
import { DeviceAndUserType } from "./types/security.types";
import { SessionType } from "../auth/types/token.type";
import { WithId } from "mongodb";

class SecurityService {
  async deleteDevice(token: string, deviceId: string): Promise<void> {
    const { userId } = tokenService.getDataToken(token);
    const device = await this.checkOwnerDevice({ deviceId: deviceId, userId: userId });

    await securityRepository.deleteById(device._id.toString());
  }

  async deleteDevices(token: string): Promise<void> {
    const { userId, deviceId } = tokenService.getDataToken(token);
    await securityRepository.deleteAllExceptCurrent({ deviceId, userId });
  }

  async checkOwnerDevice(data: DeviceAndUserType): Promise<WithId<SessionType>> {
    const isDevice = await securityRepository.findByIat(data.deviceId);
    if (!isDevice) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const device = await securityRepository.findByDeviceIdAndUserId(data);
    if (!device) {
      throw new CustomError(TYPE_ERROR.FORBIDDEN_ERROR);
    }

    return device;
  }
}

export const securityService = new SecurityService();
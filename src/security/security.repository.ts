import { ObjectId, WithId } from "mongodb";
import { SessionType } from "../auth/types/token.type";
import { DeviceAndUserType } from "./types/security.types";
import { SessionModel } from "../common/db/schemes/sessionSchema";

class SecurityRepository {
  async findByDeviceIdAndUserId(data: DeviceAndUserType): Promise<WithId<SessionType> | null> {
    return SessionModel.findOne({ deviceId: data.deviceId, userId: data.userId }).lean();
  }

  async findByDeviceId(deviceId: string): Promise<WithId<SessionType> | null> {
    return SessionModel.findOne({ deviceId: deviceId }).lean();
  }

  async deleteById(id: string): Promise<void> {
    await SessionModel.deleteOne({ _id: new ObjectId(id) });
  }

  async deleteAllExceptCurrent(data: { userId: string, deviceId: string }): Promise<void> {
    await SessionModel.deleteMany({
      userId: data.userId,
      deviceId: { $ne: data.deviceId }
    });
  }
}

export const securityRepository = new SecurityRepository();
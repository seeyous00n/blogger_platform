import { sessionCollection } from "../db";
import { ObjectId, WithId } from "mongodb";
import { SessionType } from "../auth/types/token.type";
import { DeviceAndUserType } from "./types/security.types";

class SecurityRepository {
  async findByDeviceIdAndUserId(data: DeviceAndUserType): Promise<WithId<SessionType> | null> {
    return await sessionCollection.findOne({ deviceId: data.deviceId, userId: data.userId });
  }

  async findByIat(deviceId: string): Promise<WithId<SessionType> | null> {
    return await sessionCollection.findOne({ deviceId: deviceId });
  }

  async deleteById(id: string): Promise<void> {
    await sessionCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async deleteAllExceptCurrent(data: { userId: string, deviceId: string }): Promise<void> {
    await sessionCollection.deleteMany({
      userId: data.userId,
      deviceId: { $ne: data.deviceId }
    });
  }
}

export const securityRepository = new SecurityRepository();
import { tokensCollection } from "../db";
import { ObjectId, WithId } from "mongodb";
import { TokenEntityType } from "../auth/types/token.type";
import { DeviceAndUserType } from "./types/security.types";

class SecurityRepository {
  async findByDeviceIdAndUserId(data: DeviceAndUserType): Promise<WithId<TokenEntityType> | null> {
    return await tokensCollection.findOne({ deviceId: data.deviceId, userId: data.userId });
  }

  async findByIat(deviceId: string): Promise<WithId<TokenEntityType> | null> {
    return await tokensCollection.findOne({ deviceId: deviceId });
  }

  async deleteById(id: string): Promise<void> {
    await tokensCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async deleteAllExceptCurrent(data: { userId: string, deviceId: string }): Promise<void> {
    await tokensCollection.deleteMany({
      userId: data.userId,
      deviceId: { $ne: data.deviceId }
    });
  }
}

export const securityRepository = new SecurityRepository();
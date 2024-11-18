import { sessionCollection } from "../db";
import { SessionType, UpdateSessionType } from "./types/token.type";
import { InsertOneResult, ObjectId, WithId } from "mongodb";

class AuthRepository {
  async createByData(data: SessionType): Promise<InsertOneResult<SessionType>> {
    return await sessionCollection.insertOne(data);
  };

  async updateSessionById(id: ObjectId, data: UpdateSessionType): Promise<void> {
    await sessionCollection.updateOne(
      { _id: id },
      { $set: { tokenIat: data.tokenIat, lastActiveDate: data.lastActiveDate } }
    );
  }

  async deleteById(id: Object): Promise<void> {
    await sessionCollection.deleteOne({ _id: id });
  }

  async findByIat(iat: number, deviceId: string): Promise<WithId<SessionType> | null> {
    return await sessionCollection.findOne({
      deviceId: deviceId,
      tokenIat: iat
    });
  }
}

export const authRepository = new AuthRepository();
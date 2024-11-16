import { sessionCollection } from "../db";
import { SessionType } from "./types/token.type";
import { InsertOneResult, WithId } from "mongodb";

class AuthRepository {
  async createByData(data: SessionType): Promise<InsertOneResult<SessionType>> {
    return await sessionCollection.insertOne(data);
  };

  async updateTokenById(id: object, tokenIat: number): Promise<void> {
    const lastActiveDate = new Date(tokenIat * 1000);
    await sessionCollection.updateOne(
      { _id: id },
      { $set: { tokenIat: tokenIat, lastActiveDate: lastActiveDate } },
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
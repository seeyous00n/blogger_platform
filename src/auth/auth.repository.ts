import { tokensCollection } from "../db";
import { TokenEntityType } from "./types/token.type";
import { InsertOneResult, WithId } from "mongodb";

class AuthRepository {
  async createByData(data: TokenEntityType): Promise<InsertOneResult<TokenEntityType>> {
    return await tokensCollection.insertOne(data);
  };

  async updateTokenById(id: object, tokenIat: number): Promise<void> {
    const lastActiveDate = new Date(tokenIat * 1000);
    await tokensCollection.updateOne(
      { _id: id },
      { $set: { tokenIat: tokenIat, lastActiveDate: lastActiveDate } },
    );
  }

  async deleteById(id: Object): Promise<void> {
    await tokensCollection.deleteOne({ _id: id });
  }

  async findByIat(iat: number, deviceId: string): Promise<WithId<TokenEntityType> | null> {
    return await tokensCollection.findOne({
      deviceId: deviceId,
      tokenIat: iat
    });
  }
}

export const authRepository = new AuthRepository();
import { tokensCollection } from "../db";
import { TokenEntityType } from "./types/token.type";
import { InsertOneResult, WithId } from "mongodb";

class AuthRepository {
  async createByData(data: TokenEntityType): Promise<InsertOneResult<TokenEntityType>> {
    return await tokensCollection.insertOne(data);
  };

  async updateTokenById(id: object, refreshToken: string): Promise<void> {
    await tokensCollection.updateOne(
      { _id: id },
      { $set: { refreshToken: refreshToken } },
    );
  }

  async deleteById(id: Object): Promise<void> {
    await tokensCollection.deleteOne({ _id: id });
  }

  async findByToken(token: string): Promise<WithId<TokenEntityType> | null> {
    return await tokensCollection.findOne({ refreshToken: token });
  }
}

export const authRepository = new AuthRepository();
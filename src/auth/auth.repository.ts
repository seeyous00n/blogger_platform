import { tokensCollection } from "../db";
import { TokenEntityType } from "./types/token.type";
import { InsertOneResult, WithId } from "mongodb";

class AuthRepository {
  async createByData(data: TokenEntityType): Promise<InsertOneResult<TokenEntityType>> {
    return await tokensCollection.insertOne(data);
  };

  async updateTokenById(id: object, tokenIat: number): Promise<void> {
    await tokensCollection.updateOne(
      { _id: id },
      { $set: { tokenIat: tokenIat } },
    );
  }

  async deleteById(id: Object): Promise<void> {
    await tokensCollection.deleteOne({ _id: id });
  }

  async findByIat(iat: number, userId: string): Promise<WithId<TokenEntityType> | null> {
    return await tokensCollection.findOne({
      $and: [
        { userId: userId },
        { tokenIat: iat }
      ]
    });
  }
}

export const authRepository = new AuthRepository();
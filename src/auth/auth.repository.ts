import { tokensCollection } from "../db";
import { TokenEntityType } from "./types/token.type";
import { InsertOneResult, WithId } from "mongodb";

class AuthRepository {
  async createByData(data: TokenEntityType): Promise<InsertOneResult<TokenEntityType>> {
    return await tokensCollection.insertOne(data);
  };

  async updateTokenById(id: object, oldIat: number, tokenIat: number): Promise<void> {
    await tokensCollection.updateOne(
      {
        $and: [
          { _id: id },
          { tokenIat: oldIat }
        ]
      },
      { $set: { tokenIat: tokenIat } },
    );
  }

  async deleteById(id: Object): Promise<void> {
    await tokensCollection.deleteOne({ _id: id });
  }

  async findByIat(iat: number): Promise<WithId<TokenEntityType> | null> {
    return await tokensCollection.findOne({ tokenIat: iat });
  }
}

export const authRepository = new AuthRepository();
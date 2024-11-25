import { SessionType, UpdateSessionType } from "./types/token.type";
import { ObjectId, WithId } from "mongodb";
import { SessionModel } from "../common/db/schemes/sessionSchema";
import { HydratedDocument } from "mongoose";

class AuthRepository {
  async createSessionByData(data: SessionType): Promise<HydratedDocument<SessionType>> {
    return await SessionModel.create(data);
  };

  async updateSessionById(id: ObjectId, data: UpdateSessionType): Promise<void> {
    await SessionModel.updateOne(
      { _id: id },
      { $set: { tokenIat: data.tokenIat, tokenExp: data.tokenExp, lastActiveDate: data.lastActiveDate } }
    );
  }

  async deleteSessionById(id: Object): Promise<void> {
    await SessionModel.deleteOne({ _id: id });
  }

  async findSessionByIat(iat: number, deviceId: string): Promise<WithId<SessionType> | null> {
    return SessionModel.findOne({
      deviceId: deviceId,
      tokenIat: iat
    }).lean();
  }
}

export const authRepository = new AuthRepository();
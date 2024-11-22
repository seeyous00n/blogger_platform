import { SessionType, UpdateSessionType } from "./types/token.type";
import { ObjectId, WithId } from "mongodb";
import { SessionModel } from "../common/db/schemes/sessionSchema";

class AuthRepository {
  async createByData(data: SessionType) {
    return await SessionModel.create(data);
  };

  async updateSessionById(id: ObjectId, data: UpdateSessionType): Promise<void> {
    await SessionModel.updateOne(
      { _id: id },
      { $set: { tokenIat: data.tokenIat, lastActiveDate: data.lastActiveDate } }
    );
  }

  async deleteById(id: Object): Promise<void> {
    await SessionModel.deleteOne({ _id: id });
  }

  async findByIat(iat: number, deviceId: string): Promise<WithId<SessionType> | null> {
    return SessionModel.findOne({
      deviceId: deviceId,
      tokenIat: iat
    }).lean();
  }
}

export const authRepository = new AuthRepository();
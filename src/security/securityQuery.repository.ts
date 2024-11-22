import { SecurityViewDto } from "./dto/securityView.dto";
import { SessionModel } from "../common/db/schemes/sessionSchema";

class SecurityQueryRepository {
  async getDevises(userId: string): Promise<SecurityViewDto[] | null> {
    const result = await SessionModel.find({ userId: userId }).lean();
    if (!result) {
      return null;
    }

    return result.map((item) => new SecurityViewDto(item));
  }
}

export const securityQueryRepository = new SecurityQueryRepository();
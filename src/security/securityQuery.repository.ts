import { sessionCollection } from "../db";
import { SecurityViewDto } from "./dto/securityView.dto";

class SecurityQueryRepository {
  async getDevises(userId: string): Promise<SecurityViewDto[] | null> {
    const result = await sessionCollection.find({ userId: userId }).toArray();
    if (!result) {
      return null;
    }

    return result.map((item) => new SecurityViewDto(item));
  }
}

export const securityQueryRepository = new SecurityQueryRepository();
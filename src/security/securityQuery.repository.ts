import { SecurityViewDto } from "./dto/securityView.dto";
import { SessionModel } from "../common/db/schemes/sessionSchema";
import { tokenService } from "../common/services/token.service";

class SecurityQueryRepository {
  async getDevises(token: string): Promise<SecurityViewDto[] | null> {
    const { userId } = tokenService.getDataToken(token);
    const result = await SessionModel.find({ userId: userId }).lean();
    if (!result) {
      return null;
    }

    return result.map((item) => new SecurityViewDto(item));
  }
}

export const securityQueryRepository = new SecurityQueryRepository();
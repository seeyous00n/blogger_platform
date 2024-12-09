import { SecurityViewDto } from "./dto/securityView.dto";
import { SessionModel } from "../common/db/schemes/sessionSchema";
import { TokenService } from "../common/services/token.service";
import { inject, injectable } from "inversify";

@injectable()
export class SecurityQueryRepository {
  constructor(@inject(TokenService) private tokenService: TokenService) {
  }

  async getDevises(token: string): Promise<SecurityViewDto[] | null> {
    const { userId } = this.tokenService.getDataToken(token);
    const result = await SessionModel.find({ userId: userId }).lean();
    if (!result) {
      return null;
    }

    return result.map((item) => new SecurityViewDto(item));
  }
}
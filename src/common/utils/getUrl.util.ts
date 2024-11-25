import { SETTINGS } from "../settings";

class GetUrlUtil {
  registrationConfirmation(code: string): string {
    return `${SETTINGS.API_URL}/auth/registration-confirmation?code=${code}`;
  }

  passwordRecovery(code: string): string {
    return `${SETTINGS.API_URL}/auth/password-recovery?recoveryCode=${code}`;
  }
}

export const getUrlUtil = new GetUrlUtil();
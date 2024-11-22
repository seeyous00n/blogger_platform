import { ObjectId } from "mongodb";

export type AuthType = {
  loginOrEmail: string,
  password: string,
}

export type DataInAccessTokenType = {
  userId: string
}

export const ERROR = {
  MESSAGE: {
    LOGIN: 'Error email/login',
    IS_CONFIRMED: 'code confirmed',
    EXPIRATION_CODE: 'exp code',
    EMAIL_NOT_FOUND: 'email not found',
    EMAIL_CONFIRMED: 'email is confirmed',
    INCORRECT_CODE: 'incorrect code',
    UNIQUE_EMAIL_AND_LOGIN: 'email and login should be unique',
    INCORRECT_RECOVERY_CODE: 'incorrect recovery code',
    EXPIRATION_RECOVERY_CODE: 'exp recovery code',
  },
  FIELD: {
    CODE: 'code',
    EMAIL: 'email',
    LOGIN: 'login',
    RECOVERY_CODE: 'recoveryCode'
  },
};

export const TYPE_EMAIL = {
  REGISTRATION: 'registration',
  RESEND_CODE: 'resendCode',
  RECOVERY_CODE: 'recoveryCode',
};

export type InputRecoveryType = {
  email: string
}

export type updateRecoveryCodeType = {
  id: ObjectId,
  code: string,
  expirationDate: Date | null
}

export type InputNewPasswordType = {
  newPassword: string,
  recoveryCode: string
}
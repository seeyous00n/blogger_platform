export type AuthType = {
  loginOrEmail: string,
  password: string,
}

export type TokenType = {
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
  },
  FIELD: {
    CODE: 'code',
    EMAIL: 'email',
  },
};
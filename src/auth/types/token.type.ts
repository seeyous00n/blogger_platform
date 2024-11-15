export type TokenEntityType = {
  userId: string,
  tokenIat: number,
  tokenExp: number
  ip: string,
  title: string,
  deviceId: string,
  lastActiveDate: Date
}

export const TOKENS_NAME = {
  REFRESH_TOKEN: 'refreshToken',
  ACCESS_TOKEN: 'accessToken',
};

export type PairTokensType = {
  accessToken: string,
  refreshToken: string,
  iat: number
}
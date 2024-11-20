export type SessionType = {
  userId: string,
  tokenIat: number,
  tokenExp: number
  ip: string,
  title: string,
  deviceId: string,
  lastActiveDate: Date
}

export type PairTokensType = {
  accessToken: string,
  refreshToken: string,
  iat: number
}

export type CreateTokensType = {
  userId: string,
  ip: string,
  title: string
}

export type UpdateSessionType = { tokenIat: number, lastActiveDate: Date }

export const TOKENS_NAME = {
  REFRESH_TOKEN: 'refreshToken',
  ACCESS_TOKEN: 'accessToken',
};
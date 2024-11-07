export type TokenEntityType = {
  userId: string,
  refreshToken: string
}

export const TOKENS_NAME = {
  REFRESH_TOKEN: 'refreshToken',
  ACCESS_TOKEN: 'accessToken',
}

export type PairTokensType = {
  accessToken: string,
  refreshToken: string
}
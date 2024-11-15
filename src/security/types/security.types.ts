export type SecurityType = {
  ip: string,
  title: string,
  lastActiveDate: string,
  deviceId: string
}

export type DeviceAndTokenType = {
  deviceId: string,
  tokenIat: number
}

export type DeviceAndUserType = {
  deviceId: string,
  userId: string
}

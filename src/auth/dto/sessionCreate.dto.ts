import { CreateSessionDtoType } from "../types/token.type";

export class SessionCreateDto {
  ip: string;
  title: string;
  deviceId: string;
  userId: string;
  tokenIat: number;
  tokenExp: number;
  lastActiveDate: Date;

  constructor(model: CreateSessionDtoType) {
    this.ip = model.ip;
    this.title = model.title;
    this.deviceId = model.deviceId;
    this.userId = model.userId;
    this.tokenIat = model.tokenIat;
    this.tokenExp = model.tokenExp;
    this.lastActiveDate = new Date(model.tokenIat * 1000);
  }
}
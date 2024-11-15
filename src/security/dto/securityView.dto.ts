import { TokenEntityType } from "../../auth/types/token.type";

export class SecurityViewDto {
  ip: string;
  title: string;
  lastActiveDate: Date;
  deviceId: string;

  constructor(model: TokenEntityType) {
    this.ip = model.ip;
    this.title = model.title;
    this.lastActiveDate = model.lastActiveDate;
    this.deviceId = model.deviceId;
  }
}
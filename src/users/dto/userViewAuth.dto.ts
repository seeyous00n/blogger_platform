import { UserViewAuthType } from '../types/user.types';

export class UserViewAuthDto {
  email;
  login;
  userId;

  constructor(model: UserViewAuthType) {
    this.email = model.email;
    this.login = model.login;
    this.userId = model._id.toString();
  }
}
import { UserType } from '../types/user.types';

export class UserViewAuthDto {
  email;
  login;
  userId;

  constructor(model: UserType) {
    this.email = model.email;
    this.login = model.login;
    this.userId = model._id.toString();
  }
}
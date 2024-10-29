import { UserType } from '../types/user.types';

export class UserViewDto {
  id;
  login;
  email;
  createdAt;

  constructor(model: UserType) {
    this.id = model._id.toString();
    this.login = model.login;
    this.email = model.email;
    this.createdAt = model.createdAt;
  }
}
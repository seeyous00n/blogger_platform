import { UserType } from '../types/user-types';

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
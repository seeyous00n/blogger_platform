import { add } from "date-fns";
import { CreateUserDtoType } from "../types/user.types";
import { createUuid } from "../../common/utils/createUuid.util";

export class UserCreateDto {
  login: string;
  email: string;
  password: {
    hash: string;
    recovery: null;
    expirationDate: null
  };
  createdAt: string;
  emailConfirmation: {
    confirmationCode: string,
    isConfirmed: boolean,
    expirationDate: Date
  };

  constructor(model: CreateUserDtoType) {
    this.login = model.login;
    this.email = model.email;
    this.password = {
      hash: model.hash,
      recovery: null,
      expirationDate: null,
    };
    this.createdAt = new Date().toISOString();
    this.emailConfirmation = {
      confirmationCode: createUuid(),
      isConfirmed: false,
      expirationDate: add(new Date(), { hours: 1 }),
    };
  }
}
import { WithId } from 'mongodb';
import { UserEntityType } from '../types/user.types';

export type UserByEmailOrLogin = {
  email: WithId<UserEntityType> | null,
  login: WithId<UserEntityType> | null
}
import { userQueryStringType } from '../types/types';
import { BaseQueryHelper } from './base-query-helper';

export class UserQueryHelper extends BaseQueryHelper {
  protected searchLoginTerm;
  protected searchEmailTerm;

  constructor(queryString: userQueryStringType, search: any) {
    super(queryString, search);
    this.searchLoginTerm = queryString.searchLoginTerm || null;
    this.searchEmailTerm = queryString.searchEmailTerm || null;
  }
}
import { QueryHelper } from './query-helper';
import { ObjectId } from 'mongodb';

export class UserQueryHelper extends QueryHelper{
  // sortBy;
  // sortDirection;
  // pageNumber;
  // pageSize;
  searchLoginTerm;
  searchEmailTerm;

  constructor(queryString: any) {
    super(queryString);
    // this.sortBy = queryString.sortBy || 'createdAt';
    // this.sortDirection = queryString.sortDirection || 'desc';
    // this.pageNumber = queryString.pageNumber || '1';
    // this.pageSize = queryString.pageSize || '10';
    this.searchLoginTerm = queryString.searchLoginTerm || null;
    this.searchEmailTerm = queryString.searchEmailTerm || null;
  }

  userParsFilter() {
    const loginFilter = this.searchLoginTerm ? { login: { $regex: this.searchLoginTerm, $options: 'i' } } : {};
    const emailFilter = this.searchEmailTerm ? { email: { $regex: this.searchEmailTerm, $options: 'i' } } : {};

    return {
      search: { $or: [loginFilter, emailFilter] },
      sort: { [this.sortBy]: this.sortDirection === 'asc' ? 1 : -1 },
      skip: (Number(this.pageNumber) - 1) * Number(this.pageSize),
      limit: Number(this.pageSize),
    };
  }
}
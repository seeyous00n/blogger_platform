import { QueryHelper } from './query-helper';

export class UserQueryHelper extends QueryHelper {
  searchLoginTerm;
  searchEmailTerm;

  constructor(queryString: any) {
    super(queryString);
    this.searchLoginTerm = queryString.searchLoginTerm || null;
    this.searchEmailTerm = queryString.searchEmailTerm || null;
  }

  // @ts-ignore
  parsFilter() {
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
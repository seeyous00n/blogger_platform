import { queryStringType } from '../types/types';
import { Sort } from 'mongodb';

export class BaseQueryFieldsUtil {
  protected searchNameTerm;
  protected sortBy;
  protected sortDirection;
  public pageNumber;
  public pageSize;

  public filter;

  constructor(queryString: queryStringType, search = {}) {
    this.searchNameTerm = queryString.searchNameTerm || null;
    this.sortBy = queryString.sortBy || 'createdAt';
    this.sortDirection = queryString.sortDirection || 'desc';
    this.pageNumber = +queryString.pageNumber || 1;
    this.pageSize = +queryString.pageSize || 10;

    this.filter = {
      search: search,
      sort: { [this.sortBy]: this.sortDirection === 'asc' ? 1 : -1 } as Sort,
      skip: (this.pageNumber - 1) * this.pageSize,
      limit: this.pageSize,
    };
  }
}
import { queryStringType } from '../types/types';
import { FilterQuery } from "mongoose";

export class BaseQueryFieldsUtil {
  protected searchNameTerm;
  protected sortBy;
  protected sortDirection;
  public pageNumber;
  public pageSize;

  public filter: FilterQuery<queryStringType>;

  constructor(queryString: queryStringType, search = {}) {
    this.searchNameTerm = queryString.searchNameTerm || null;
    this.sortBy = queryString.sortBy || 'createdAt';
    this.sortDirection = queryString.sortDirection || 'desc';
    this.pageNumber = +queryString.pageNumber || 1;
    this.pageSize = +queryString.pageSize || 10;

    this.filter = {
      search: search,
      sort: { [this.sortBy]: this.sortDirection === 'asc' ? 1 : -1 },
      skip: (this.pageNumber - 1) * this.pageSize,
      limit: this.pageSize,
    };
  }
}
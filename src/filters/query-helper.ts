import { queryStringType } from '../types/types';
import { ObjectId } from 'mongodb';
import { ParsFilterType } from './types';

export class QueryHelper {
  searchNameTerm;
  sortBy;
  sortDirection;
  pageNumber;
  pageSize;

  constructor(queryString: queryStringType) {
    this.searchNameTerm = queryString.searchNameTerm || null;
    this.sortBy = queryString.sortBy || 'createdAt';
    this.sortDirection = queryString.sortDirection || 'desc';
    this.pageNumber = queryString.pageNumber || '1';
    this.pageSize = queryString.pageSize || '10';
  }

  parsFilter(id?: ObjectId): ParsFilterType {
    return {
      search: id ? { blogId: id } : this.searchNameTerm ? { name: { $regex: this.searchNameTerm, $options: 'i' } } : {},
      sort: { [this.sortBy]: this.sortDirection === 'asc' ? 1 : -1 },
      skip: (Number(this.pageNumber) - 1) * Number(this.pageSize),
      limit: Number(this.pageSize),
    };
  }

}
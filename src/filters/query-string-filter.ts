import { BlogType } from '../types/blog-types';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { PostType } from '../types/post-types';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { queryStringType } from '../types/types';
import { ObjectId } from 'mongodb';
import { QueryViewModel } from '../models/ViewQueryModel';
import { TYPE_COLLECTION } from '../settings';

export class QueryStringFilter {
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

  prepareQueryString(id?: ObjectId) {
    return {
      search: id ? { blogId: id } : this.searchNameTerm ? { name: { $regex: this.searchNameTerm, $options: 'i' } } : {},
      sort: { [this.sortBy]: this.sortDirection === 'asc' ? 1 : -1 },
      skip: (Number(this.pageNumber) - 1) * Number(this.pageSize),
      limit: Number(this.pageSize),
    };
  }

  mapData(data: BlogType[] | PostType[], type: string) {
    return data.map((item) =>
      type === TYPE_COLLECTION.BLOGS
        ? new BlogsViewDto(item as BlogType)
        : new PostsViewDto(item as PostType)) as BlogsViewDto[] | PostsViewDto[];
  }

  prepareDataAnswer(count: number, data: BlogType[] | PostType[], type = TYPE_COLLECTION.BLOGS): QueryViewModel {
    const mapData = this.mapData(data, type);

    return {
      'pagesCount': Math.ceil(count / Number(this.pageSize)),
      'page': Number(this.pageNumber),
      'pageSize': Number(this.pageSize),
      'totalCount': count,
      'items': mapData,
    };
  }
}
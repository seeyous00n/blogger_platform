import { BlogType } from '../types/blog-types';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { PostType } from '../types/post-types';
import { PostsViewDto } from '../dtos/posts-view-dto';

export class QueryStringFilter {
  searchNameTerm;
  sortBy;
  sortDirection;
  pageNumber;
  pageSize;

  constructor(queryString: any) {
    this.searchNameTerm = queryString.searchNameTerm || '';
    this.sortBy = queryString.sortBy || 'createdAt';
    this.sortDirection = queryString.sortDirection || 'desc';
    this.pageNumber = queryString.pageNumber || '1';
    this.pageSize = queryString.pageSize || '10';
  }

  prepareQueryString() {
    return {
      search: this.searchNameTerm ? { name: { $regex: this.searchNameTerm, $options: 'i' } } : {},
      sort: { [this.sortBy]: this.sortDirection === 'asc' ? 1 : -1 },
      skip: (Number(this.pageNumber) - 1) * Number(this.pageSize),
      limit: Number(this.pageSize),
    };
  }

  getPrepareData(count: number, data: BlogType[] | PostType[], type = 'blogs') {
    let mapData;
    if (type === 'blogs') {
      mapData = <BlogType[]>data.map((blog) => new BlogsViewDto(<BlogType>blog));
    }
    if (type === 'posts') {
      mapData = <PostType[]>data.map((blog) => new PostsViewDto(<PostType>blog));
    }

    return {
      'pagesCount': Math.ceil(count / Number(this.pageSize)),
      'page': Number(this.pageNumber),
      'pageSize': Number(this.pageSize),
      'totalCount': count,
      'items': mapData,
    };
  }
}
import { BlogType } from '../types/blog-types';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { PostType } from '../types/post-types';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { queryStringType } from '../types/types';

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

  prepareQueryString(id?: string) {
    return {
      search: this.searchNameTerm ? { name: { $regex: this.searchNameTerm, $options: 'i' } } : {},
      sort: { [this.sortBy]: this.sortDirection === 'asc' ? 1 : -1 },
      skip: (Number(this.pageNumber) - 1) * Number(this.pageSize),
      limit: Number(this.pageSize),
      searchId: id ? { blogId: id } : {},
    };
  }

  mapData(data: BlogType[] | PostType[], type: string) {
    return data.map((item) =>
      type === 'blogs'
        ? new BlogsViewDto(item as BlogType)
        : new PostsViewDto(item as PostType));
  }

  prepareDataAnswer(count: number, data: BlogType[] | PostType[], type = 'blogs') {
    //let mapData;
    const mapData = this.mapData(data, type);
    // if (type === 'blogs') {
    //   mapData = <BlogType[]>data.map((blog) => new BlogsViewDto(<BlogType>blog));
    // }
    // if (type === 'posts') {
    //   mapData = <PostType[]>data.map((blog) => new PostsViewDto(<PostType>blog));
    // }

    return {
      'pagesCount': Math.ceil(count / Number(this.pageSize)),
      'page': Number(this.pageNumber),
      'pageSize': Number(this.pageSize),
      'totalCount': count,
      'items': mapData,
    };
  }
}
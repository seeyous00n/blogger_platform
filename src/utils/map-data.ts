import { BlogType } from '../types/blog-types';
import { PostType } from '../types/post-types';
import { TYPE_COLLECTION } from '../settings';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { QueryViewModel } from '../models/ViewQueryModel';
import { QueryHelper } from '../filters/query-helper';

export const dataMapper = (data: BlogType[] | PostType[], type: string = TYPE_COLLECTION.BLOGS) => {
  return data.map((item) =>
    type === TYPE_COLLECTION.BLOGS
      ? new BlogsViewDto(item as BlogType)
      : new PostsViewDto(item as PostType)) as BlogsViewDto[] | PostsViewDto[];
};

export const prepareDataAnswer = (resultData: BlogsViewDto[] | PostsViewDto[], count: number, queryStringParam: QueryHelper): QueryViewModel => {
  return {
    'pagesCount': Math.ceil(count / Number(queryStringParam.pageSize)),
    'page': Number(queryStringParam.pageNumber),
    'pageSize': Number(queryStringParam.pageSize),
    'totalCount': count,
    'items': resultData,
  };
};
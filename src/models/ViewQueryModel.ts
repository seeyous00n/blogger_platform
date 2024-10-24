import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { PostType } from '../types/post-types';

export type QueryViewModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogsViewDto[] | PostType[]
}

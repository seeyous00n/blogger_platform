import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { PostsViewDto } from '../dtos/posts-view-dto';

export type QueryViewModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogsViewDto[] | PostsViewDto[]
}

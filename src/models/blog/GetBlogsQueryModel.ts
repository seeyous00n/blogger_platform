import { BlogsViewDto } from '../../dtos/blogs-view-dto';

export type GetBlogsQueryModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogsViewDto[]
}

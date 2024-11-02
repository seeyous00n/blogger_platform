import { BlogsViewDto } from '../dto/blogsView.dto';

export type BlogsViewModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogsViewDto[]
}
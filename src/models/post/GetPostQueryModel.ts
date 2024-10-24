import { PostsViewDto } from '../../dtos/posts-view-dto';

export type GetPostQueryModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: PostsViewDto[]
}
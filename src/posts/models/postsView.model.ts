import { PostsViewDto } from '../dto/postsView.dto';

export type CommentsViewModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: PostsViewDto[]
}
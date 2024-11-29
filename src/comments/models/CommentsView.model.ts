import { CommentWithLikeViewDto } from '../dto/commentView.dto';

export type CommentsViewModel = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: CommentWithLikeViewDto[]
}
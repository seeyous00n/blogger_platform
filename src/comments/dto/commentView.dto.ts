import { CommentWithLikeViewType } from '../types/comment.types';

export class CommentViewDto {
  id;
  content;
  commentatorInfo;
  createdAt;
  likesInfo;

  constructor(model: CommentWithLikeViewType) {
    this.id = model._id.toString();
    this.content = model.content;
    this.commentatorInfo = model.commentatorInfo;
    this.createdAt = model.createdAt;
    this.likesInfo = {
      likesCount: model.likesCount,
      dislikesCount: model.dislikesCount,
      myStatus: model.myStatus
    };
  }
}
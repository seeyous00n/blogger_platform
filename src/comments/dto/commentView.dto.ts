import { CommentViewType } from '../types/comment.types';
import { LikeWithMyStatusType } from "../../like/types/like.types";

export class CommentWithLikeViewDto {
  id;
  content;
  commentatorInfo;
  createdAt;
  likesInfo;

  constructor(model: CommentViewType, likeModel: LikeWithMyStatusType) {
    this.id = model._id.toString();
    this.content = model.content;
    this.commentatorInfo = model.commentatorInfo;
    this.createdAt = model.createdAt;
    this.likesInfo = {
      likesCount: likeModel.likesCount,
      dislikesCount: likeModel.dislikesCount,
      myStatus: likeModel.myStatus
    };
  }
}
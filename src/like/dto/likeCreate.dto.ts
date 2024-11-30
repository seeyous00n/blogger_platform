import { InputLikeStatusType } from "../../comments/types/comment.types";

export class LikeCreateDto {
  createdAt;
  status;
  authorId;
  parentId;
  isNewLike;

  constructor(model: InputLikeStatusType) {
    this.createdAt = new Date().toISOString();
    this.status = model.likeStatus;
    this.authorId = model.authorId;
    this.parentId = model.parentId;
    this.isNewLike = model.likeStatus === 'Like' ? 1 : 0;
  }
}
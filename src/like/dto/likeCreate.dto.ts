import { InputLikeStatusType } from "../../comments/types/comment.types";

export class LikeCreateDto {
  createdAt;
  status;
  authorId;
  parentId;

  constructor(model: InputLikeStatusType) {
    this.createdAt = new Date();
    this.status = model.likeStatus;
    this.authorId = model.authorId;
    this.parentId = model.parentId;
  }
}
import { InputLikeStatusType } from "../../comments/types/comment.types";

export class LikeCreateDto {
  createdAt;
  status;
  authorId;
  parentId;
  authorLogin;
  isNewLike;

  constructor(model: InputLikeStatusType & { authorLogin: string }) {
    this.createdAt = new Date().toISOString();
    this.status = model.likeStatus;
    this.authorId = model.authorId;
    this.parentId = model.parentId;
    this.authorLogin = model.authorLogin;
    this.isNewLike = model.likeStatus === 'Like' ? 1 : 0;
  }
}
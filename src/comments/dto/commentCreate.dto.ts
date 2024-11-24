import { CommentCreateInputModel } from "../models/CommentCreateInput.model";

export class CommentCreateDto {
  postId: string;
  content: string;
  commentatorInfo: { userId: string, userLogin: string };
  createdAt: string;

  constructor(model: CommentCreateInputModel & { userLogin: string }) {
    this.postId = model.postId;
    this.content = model.comment;
    this.createdAt = new Date().toISOString();
    this.commentatorInfo = {
      userId: model.userId,
      userLogin: model.userLogin,
    };

  }
}
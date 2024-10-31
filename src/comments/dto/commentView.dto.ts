import { CommentViewType } from '../types/comment.types';

export class CommentViewDto {
  id;
  content;
  commentatorInfo;
  createdAt;

  constructor(model: CommentViewType) {
    this.id = model._id.toString();
    this.content = model.content;
    this.commentatorInfo = model.commentatorInfo;
    this.createdAt = model.createdAt;
  }
}
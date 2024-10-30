import { CommentTypes } from '../types/comment.types';

export class CommentViewDto {
  id;
  content;
  commentatorInfo;
  createdAt;

  constructor(model: CommentTypes) {
    this.id = model._id.toString();
    this.content = model.content;
    this.commentatorInfo = model.commentatorInfo;
    this.createdAt = model.createdAt;
  }
}
import { PostViewType } from '../types/post.types';

export class PostsViewDto {
  id;
  title;
  shortDescription;
  content;
  blogId;
  blogName;
  createdAt;

  constructor(model: PostViewType) {
    this.id = model._id.toString();
    this.title = model.title;
    this.shortDescription = model.shortDescription;
    this.content = model.content;
    this.blogId = model.blogId.toString();
    this.blogName = model.blogName;
    this.createdAt = model.createdAt;
  }
}
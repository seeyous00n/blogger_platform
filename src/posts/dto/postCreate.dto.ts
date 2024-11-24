import { PostCreateModel } from "../models/postCreate.model";

export class PostCreateDto {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;

  constructor(model: PostCreateModel & { blogName: string }) {
    this.title = model.title;
    this.shortDescription = model.shortDescription;
    this.content = model.content;
    this.blogId = model.blogId.toString();
    this.blogName = model.blogName;
    this.createdAt = new Date().toISOString();
  }
}
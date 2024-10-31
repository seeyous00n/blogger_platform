import { BlogViewType } from '../types/blog.types';

export class BlogsViewDto {
  id;
  name;
  description;
  websiteUrl;
  createdAt;
  isMembership;

  constructor(model: BlogViewType) {
    this.id = model._id.toString();
    this.name = model.name;
    this.description = model.description;
    this.websiteUrl = model.websiteUrl;
    this.createdAt = model.createdAt;
    this.isMembership = model.isMembership;
  }
}
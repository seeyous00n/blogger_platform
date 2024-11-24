import { BlogCreateModel } from "../models/blogCreate.model";

export class BlogCreateDto {
  name: string;
  description: string;
  websiteUrl: string;
  isMembership: false;
  createdAt: string;

  constructor(model: BlogCreateModel) {
    this.name = model.name;
    this.description = model.description;
    this.websiteUrl = model.websiteUrl;
    this.isMembership = false;
    this.createdAt = new Date().toISOString();
  }
}
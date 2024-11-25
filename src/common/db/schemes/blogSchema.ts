import mongoose, { HydratedDocument, Model } from "mongoose";
import { BlogEntityType } from "../../../blogs/types/blog.types";

const COLLECTION_BLOGS = 'blogs';

type BlogModel = Model<BlogEntityType>;

export type BlogDocument = HydratedDocument<BlogEntityType>;

const blogSchema = new mongoose.Schema<BlogEntityType>({
  name: String,
  description: String,
  websiteUrl: String,
  createdAt: String,
  isMembership: Boolean,
});

export const BlogModel = mongoose.model<BlogEntityType, BlogModel>(COLLECTION_BLOGS, blogSchema);
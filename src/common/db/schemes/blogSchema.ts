import mongoose from "mongoose";
import { BlogEntityType } from "../../../blogs/types/blog.types";

const COLLECTION_BLOGS = 'blogs';

const blogSchema = new mongoose.Schema<BlogEntityType>({
  name: String,
  description: String,
  websiteUrl: String,
  createdAt: String,
  isMembership: Boolean,
});

export const BlogModel = mongoose.model(COLLECTION_BLOGS, blogSchema);
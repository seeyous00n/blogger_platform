import mongoose from "mongoose";
import { PostEntityType } from "../../../posts/types/post.types";

const COLLECTION_POSTS = 'posts';

const postSchema = new mongoose.Schema<PostEntityType>({
  title: String,
  shortDescription: String,
  content: String,
  blogId: String,
  blogName: String,
  createdAt: String,
});

export const PostModel = mongoose.model(COLLECTION_POSTS, postSchema);
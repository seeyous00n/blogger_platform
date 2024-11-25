import mongoose, { HydratedDocument, Model } from "mongoose";
import { PostEntityType } from "../../../posts/types/post.types";

const COLLECTION_POSTS = 'posts';

type PostModel = Model<PostEntityType>;

export type PostDocument = HydratedDocument<PostEntityType>;

const postSchema = new mongoose.Schema<PostEntityType>({
  title: String,
  shortDescription: String,
  content: String,
  blogId: String,
  blogName: String,
  createdAt: String,
});

export const PostModel = mongoose.model<PostEntityType, PostModel>(COLLECTION_POSTS, postSchema);
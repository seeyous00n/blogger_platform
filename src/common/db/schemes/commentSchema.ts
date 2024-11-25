import mongoose, { HydratedDocument, Model } from "mongoose";
import { CommentEntityType } from "../../../comments/types/comment.types";

const COLLECTION_COMMENTS = 'comments';

type CommentModel = Model<CommentEntityType>;

export type CommentDocument = HydratedDocument<CommentEntityType>;

const commentSchema = new mongoose.Schema<CommentEntityType>({
  postId: String,
  content: String,
  commentatorInfo: {
    userId: String,
    userLogin: String,
  },
  createdAt: Date,
});

export const CommentModel = mongoose.model<CommentEntityType, CommentModel>(COLLECTION_COMMENTS, commentSchema);
import mongoose from "mongoose";
import { CommentEntityType } from "../../../comments/types/comment.types";

const COLLECTION_COMMENTS = 'comments';

const commentSchema = new mongoose.Schema<CommentEntityType>({
  postId: String,
  content: String,
  commentatorInfo: {
    userId: String,
    userLogin: String,
  },
  createdAt: Date,
});

export const CommentModel = mongoose.model(COLLECTION_COMMENTS, commentSchema);
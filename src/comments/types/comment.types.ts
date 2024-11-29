import { ObjectId } from 'mongodb';
import { LikeStatusType } from "../../common/db/schemes/likesSchema";
import { LikeWithMyStatusType } from "../../like/types/like.types";

export type CommentEntityType = {
  postId: string,
  content: string,
  commentatorInfo: {
    userId: string,
    userLogin: string,
  }
  createdAt: string,
}

export type CommentViewType = CommentEntityType & {
  _id: ObjectId,
}
export type CommentWithLikeViewType = CommentViewType & LikeWithMyStatusType;

export type InputLikeStatusType = {
  likeStatus: LikeStatusType,
  parentId: string,
  authorId: string
}
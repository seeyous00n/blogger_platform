import { ObjectId } from 'mongodb';
import { LikeStatusType } from "../../common/db/schemes/likesSchema";

export type CommentViewType = CommentEntityType & {
  _id: ObjectId,
}

export type CommentEntityType = {
  postId: string,
  content: string,
  commentatorInfo: {
    userId: string,
    userLogin: string,
  }
  createdAt: string,
}

export type InputLikeStatusType = {
  likeStatus: LikeStatusType,
  parentId: string,
  authorId: string
}
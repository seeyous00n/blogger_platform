import { ObjectId } from 'mongodb';

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
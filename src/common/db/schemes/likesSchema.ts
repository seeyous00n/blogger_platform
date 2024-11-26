import mongoose, { HydratedDocument, Model } from "mongoose";

const COLLECTION_LIKES = 'likes';

type LikeStatusType = 'None' | 'Like' | 'Dislike';
type TypeEntity = 'Comment' | 'Blog';

export type LikesType = {
  createdAt: Date;
  status: LikeStatusType;
  authorId: string;
  parentId: string;
  // typeEntity: TypeEntity;
}

type LikesModel = Model<LikesType>;

export type LikesDocument = HydratedDocument<LikesType>;

// const likeStatusSchema = new mongoose.Schema<LikeStatusType>({
//   status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
// });

const likesSchema = new mongoose.Schema<LikesType>({
  createdAt: { type: Date, required: true },
  status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
  authorId: { type: String, required: true },
  parentId: { type: String, required: true },
  // typeEntity: { type: String, enum: ['Comment', 'Blog'], required: true }
});

export const LikesModel = mongoose.model<LikesType, LikesModel>(COLLECTION_LIKES, likesSchema);
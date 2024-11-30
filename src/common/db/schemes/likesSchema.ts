import mongoose, { HydratedDocument, Model } from "mongoose";

const COLLECTION_LIKES = 'likes';

export type LikeStatusType = 'None' | 'Like' | 'Dislike';

export type LikesType = {
  createdAt: string;
  status: LikeStatusType;
  authorId: string;
  parentId: string;
  isNewLike: number;
}

type LikesModel = Model<LikesType>;

export type LikesDocument = HydratedDocument<LikesType>;

const likesSchema = new mongoose.Schema<LikesType>({
  createdAt: { type: String, required: true },
  status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
  authorId: { type: String, required: true },
  parentId: { type: String, required: true },
  isNewLike: { type: Number, required: true },
});

export const LikesModel = mongoose.model<LikesType, LikesModel>(COLLECTION_LIKES, likesSchema);
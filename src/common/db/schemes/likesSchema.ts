import mongoose, { HydratedDocument, Model } from "mongoose";

const COLLECTION_LIKES = 'likes';

export type LikeStatusType = 'None' | 'Like' | 'Dislike';

export type LikesType = {
  createdAt: Date;
  status: LikeStatusType;
  authorId: string;
  parentId: string;
}

type LikesModel = Model<LikesType>;

export type LikesDocument = HydratedDocument<LikesType>;


const likesSchema = new mongoose.Schema<LikesType>({
  createdAt: { type: Date, required: true },
  status: { type: String, enum: ['None', 'Like', 'Dislike'], required: true },
  authorId: { type: String, required: true },
  parentId: { type: String, required: true },
});

export const LikesModel = mongoose.model<LikesType, LikesModel>(COLLECTION_LIKES, likesSchema);
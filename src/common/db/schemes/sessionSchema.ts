import mongoose, { HydratedDocument, Model } from "mongoose";
import { SessionType } from "../../../auth/types/token.type";

const COLLECTION_SESSIONS = 'sessions';

type SessionModel = Model<SessionType>;

export type SessionDocument = HydratedDocument<SessionType>;

const sessionSchema = new mongoose.Schema<SessionType>({
  userId: String,
  tokenIat: Number,
  tokenExp: Number,
  ip: String,
  title: String,
  deviceId: String,
  lastActiveDate: Date
});

export const SessionModel = mongoose.model<SessionType, SessionModel>(COLLECTION_SESSIONS, sessionSchema);
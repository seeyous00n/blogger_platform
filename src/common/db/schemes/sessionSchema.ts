import mongoose from "mongoose";
import { SessionType } from "../../../auth/types/token.type";

const COLLECTION_SESSIONS = 'sessions';

const sessionSchema = new mongoose.Schema<SessionType>({
  userId: String,
  tokenIat: Number,
  tokenExp: Number,
  ip: String,
  title: String,
  deviceId: String,
  lastActiveDate: Date
});

export const SessionModel = mongoose.model(COLLECTION_SESSIONS, sessionSchema);
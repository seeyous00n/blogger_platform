import mongoose from "mongoose";
import { RateLimitType } from "../../types/rateLimit.types";

const COLLECTION_RATE_LIMIT = 'rateLimit';

const rateLimitSchema = new mongoose.Schema<RateLimitType>({
  IP: String,
  URL: String,
  date: Date
});

export const RateLimitModel = mongoose.model(COLLECTION_RATE_LIMIT, rateLimitSchema);
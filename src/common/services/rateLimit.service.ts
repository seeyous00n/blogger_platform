import { rateLimitCollection } from "../../db";
import { GetVisitorsType, RateLimitType } from "../types/rateLimit.types";
import { add } from "date-fns";

const SECONDS_AGO = -10;

class RateLimitService {
  async addVisitor(data: RateLimitType) {
    await rateLimitCollection.insertOne({
      IP: data.IP,
      URL: data.URL,
      date: new Date()
    });
  }

  async getCountVisitors(data: GetVisitorsType) {
    return await rateLimitCollection.countDocuments({
      IP: data.IP,
      URL: data.URL,
      date: { $gte: add(new Date(), { seconds: SECONDS_AGO }) }
    });
  }
}

export const rateLimitService = new RateLimitService();
import { rateLimitCollection } from "../../db";
import { GetVisitorsType, RateLimitType } from "../middlewares/rateLimit/types";
import { add } from "date-fns";

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
      date: { $gte: add(new Date(), { seconds: -10 }) }
    });
  }
}

export const rateLimitService = new RateLimitService();
import { GetVisitorsType, RateLimitType } from "../types/rateLimit.types";
import { add } from "date-fns";
import { RateLimitModel } from "../db/schemes/rateLimitSchema";

const SECONDS_AGO = -10;

class RateLimitService {
  async addVisitor(data: RateLimitType): Promise<void> {
    await RateLimitModel.create({
      IP: data.IP,
      URL: data.URL,
      date: new Date()
    });
  }

  async getCountVisitors(data: GetVisitorsType): Promise<number> {
    return RateLimitModel.countDocuments({
      IP: data.IP,
      URL: data.URL,
      date: { $gte: add(new Date(), { seconds: SECONDS_AGO }) }
    });
  }
}

export const rateLimitService = new RateLimitService();
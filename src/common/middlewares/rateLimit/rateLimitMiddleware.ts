import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS_CODE } from "../../settings";
import { rateLimitService } from "../../../composition-root";

const VISIT_LIMIT = 5;

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dataForGetCount = {
      IP: String(req.ip),
      URL: req.originalUrl,
    };

    const dataVisitor = {
      ...dataForGetCount,
      date: new Date()
    };

    await rateLimitService.addVisitor(dataVisitor);
    const countsRequest = await rateLimitService.getCountVisitors(dataForGetCount);

    if (countsRequest > VISIT_LIMIT) {
      res.status(HTTP_STATUS_CODE.TOO_MANY_REQUESTS_429).json();
      return;
    }
  } catch (e: any) {
    console.log('ERROR', e.message);
  }

  next();
};
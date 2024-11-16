import { NextFunction, Request, Response } from 'express';
import { add } from "date-fns";
import { rateLimitCollection } from "../../../db";

export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      IP: String(req.ip),
      URL: req.originalUrl,
    };

    await rateLimitCollection.insertOne({
      IP: data.IP,
      URL: data.URL,
      date: new Date()
    });

    const countsRequest = await rateLimitCollection.countDocuments({
      IP: data.IP,
      URL: data.URL,
      date: { $gte: add(new Date(), { seconds: -10 }) }
    });

    if (countsRequest > 5) {
      res.status(429).json('Time out');
      return;
    }

  } catch (e: any) {
    console.log('ERROR', e.message);
  }

  next();
};
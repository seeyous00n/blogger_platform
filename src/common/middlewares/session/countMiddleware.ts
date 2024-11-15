import { NextFunction, Request, Response } from 'express';
import { add } from "date-fns";
import { sessionCollection } from "../../../db";

export const countMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      IP: String(req.ip),
      URL: req.originalUrl,
    };

    await sessionCollection.insertOne({
      IP: data.IP,
      URL: data.URL,
      date: new Date()
    });

    const countsRequest = await sessionCollection.countDocuments({
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
import { NextFunction, Request, Response } from 'express';
import { add } from "date-fns";
import { sessionCollection } from "../../../db";

export const countMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insertResult = await sessionCollection.insertOne({
      IP: String(req.ip),
      URL: req.originalUrl,
      date: new Date()
    });

    const countsRequest = await sessionCollection.countDocuments({
      IP: String(req.ip),
      URL: req.originalUrl,
      date: { $gte: add(new Date(), { seconds: -10 }) }
    });

    console.log('countsRequest', countsRequest);

    if (countsRequest > 5) {
      res.status(429).json('Time out');
      return;
    }

  } catch (e: any) {
    console.log('ERROR', e.message);
  }

  next();
};
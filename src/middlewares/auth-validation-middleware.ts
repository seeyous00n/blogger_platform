import { NextFunction, Request, Response } from 'express';

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const LOG = 'admin';
  const PASS = 'qwerty';
  const BASIC = 'Basic';

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json('Unauthorized');
  }

  if (authHeader) {
    const authorization = authHeader.split(' ');
    const decodedData = Buffer.from(authorization[1], 'base64').toString('utf-8').split(':');
    if (decodedData[0] !== LOG || decodedData[1] !== PASS || authorization[0] !== BASIC) {
      res.status(401).json('Unauthorized');
    }
  }
  next();
};
import { NextFunction, Request, Response } from 'express';

export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const log = 'admin';
  const pass = 'qwerty';

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json('Unauthorized');
  }
  if (authHeader) {
    const authorization = authHeader.split(' ');
    const decodedData = Buffer.from(authorization[1], 'base64').toString('utf-8').split(':');
    if (decodedData[0] !== log || decodedData[1] !== pass) {
      res.status(401).json('Unauthorized');
    }
  }
  next();
};
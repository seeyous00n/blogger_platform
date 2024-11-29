import { NextFunction, Response } from 'express';
import { tokenService } from "../../composition-root";
import { RequestBase } from "../types/types";

export const isUserAuthorized = (req: RequestBase, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.authorizedUserId = undefined;
  } else {
    const [_, token] = authHeader.split(' ');
    const payload = tokenService.validateAccessToken(token);
    req.authorizedUserId = payload ? payload.userId : undefined;
  }

  next();
};
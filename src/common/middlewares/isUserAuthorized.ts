import { NextFunction, Response } from 'express';
import { RequestBase } from "../types/types";
import { TokenService } from "../services/token.service";
import { container } from "../../composition-root";

export const isUserAuthorized = (req: RequestBase, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.authorizedUserId = undefined;
  } else {
    const tokenService = container.resolve(TokenService);

    const [_, token] = authHeader.split(' ');
    const payload = tokenService.validateAccessToken(token);
    req.authorizedUserId = payload ? payload.userId : undefined;
  }

  next();
};
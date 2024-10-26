import { Request, Response } from 'express';
import { RequestWithBody, RequestWithQuery, userQueryStringType } from '../types/types';
import { UserCreateModel } from '../models/user/UserCreateModel';
import { userService } from '../services/user-service';
import { HTTP_STATUS_CODE } from '../settings';
import { sendError } from '../utils/error-handler';
import { usersQueryRepository } from '../repositories/users-query-repository';
import { URIParamsModel } from '../models/URIParamsModel';

class UsersController {
  getUsers = async (req: RequestWithQuery<URIParamsModel, userQueryStringType>, res: Response) => {
    try {
      const result = await usersQueryRepository.findUsers(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  createUser = async (req: RequestWithBody<UserCreateModel>, res: Response) => {
    try {
      const result = await userService.createUser(req.body);
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      await userService.deleteUser(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };
}

export const usersController = new UsersController();
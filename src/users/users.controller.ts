import { Request, Response } from 'express';
import { RequestWithBody, RequestWithQuery, userQueryStringType } from '../common/types/types';
import { UserCreateModel } from './models/userCreate.model';
import { userService } from './user.service';
import { HTTP_STATUS_CODE } from '../common/settings';
import { sendError } from '../common/errorHandler';
import { usersQueryRepository } from './usersQuery.repository';
import { UriParamsModel } from '../common/models/uriParams.model';

class UsersController {
  getUsers = async (req: RequestWithQuery<UriParamsModel, userQueryStringType>, res: Response) => {
    try {
      const result = await usersQueryRepository.findUsers(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  createUser = async (req: RequestWithBody<UserCreateModel>, res: Response) => {
    try {
      const userId = await userService.createUser(req.body);
      const result = await usersQueryRepository.findById(userId.insertedId.toString())
      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (e: any) {
      sendError(e, res);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      await userService.deleteUserById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (e: any) {
      sendError(e, res);
    }
  };
}

export const usersController = new UsersController();
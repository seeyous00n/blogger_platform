import { Request, Response } from 'express';
import { RequestWithBody, RequestWithQuery, userQueryStringType } from '../common/types/types';
import { userService } from './user.service';
import { HTTP_STATUS_CODE } from '../common/settings';
import { sendError } from '../common/errorHandler';
import { usersQueryRepository } from './usersQuery.repository';
import { UriParamsModel } from '../common/models/uriParams.model';
import { UserCreateInputModel } from './models/userCreateInput.model';

class UsersController {
  getUsers = async (req: RequestWithQuery<UriParamsModel, userQueryStringType>, res: Response) => {
    try {
      const result = await usersQueryRepository.findUsers(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  createUser = async (req: RequestWithBody<UserCreateInputModel>, res: Response) => {
    try {
      const userId = await userService.createUser(req.body);
      await userService.updateIsConfirmed(userId.insertedId);
      const result = await usersQueryRepository.findById(userId.insertedId.toString());
      if (!result) {
        res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json();
        return;
      }

      res.status(HTTP_STATUS_CODE.CREATED_201).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      await userService.deleteUserById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}

export const usersController = new UsersController();
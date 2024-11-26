import { Request, Response } from 'express';
import { RequestOnlyQuery, RequestWithBody, userQueryStringType } from '../common/types/types';
import { UserService } from './user.service';
import { HTTP_STATUS_CODE } from '../common/settings';
import { sendError } from '../common/errorHandler';
import { UserCreateInputModel } from './models/userCreateInput.model';
import { UsersQueryRepository } from "./usersQuery.repository";

export class UsersController {
  constructor(private userService: UserService,
              private usersQueryRepository: UsersQueryRepository) {
  }

  getUsers = async (req: RequestOnlyQuery<userQueryStringType>, res: Response) => {
    try {
      const result = await this.usersQueryRepository.findUsers(req.query);
      res.status(HTTP_STATUS_CODE.OK_200).json(result);
    } catch (error) {
      sendError(error, res);
    }
  };

  createUser = async (req: RequestWithBody<UserCreateInputModel>, res: Response) => {
    try {
      const user = await this.userService.createUser(req.body);
      await this.userService.updateIsConfirmed(user._id);
      const result = await this.usersQueryRepository.findUserById(user._id.toString());
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
      await this.userService.deleteUserById(req.params.id);
      res.status(HTTP_STATUS_CODE.NO_CONTENT_204).json();
    } catch (error) {
      sendError(error, res);
    }
  };
}
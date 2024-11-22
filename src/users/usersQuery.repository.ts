import { UserViewDto } from './dto/usersView.dto';
import { UserViewAuthDto } from './dto/userViewAuth.dto';
import { userQueryStringType } from '../common/types/types';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { ObjectId } from 'mongodb';
import { isObjectId } from '../common/adapters/mongodb.service';
import { UsersViewModel } from './models/usersView.model';
import { UserModel } from "../common/db/schemes/userSchema";

class UsersQueryRepository {
  async findUsers(queryString: userQueryStringType): Promise<UsersViewModel> {
    const loginFilter = queryString.searchLoginTerm ? {
      login: {
        $regex: queryString.searchLoginTerm,
        $options: 'i',
      },
    } : {};
    const emailFilter = queryString.searchEmailTerm ? {
      email: {
        $regex: queryString.searchEmailTerm,
        $options: 'i',
      },
    } : {};
    const searchString = { $or: [loginFilter, emailFilter] };
    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const result = await UserModel
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort as any)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .lean();

    const blogsCount = await UserModel.countDocuments(queryHelper.filter.search);
    const resultData = result.map((item) => new UserViewDto(item));

    return {
      'pagesCount': Math.ceil(blogsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': blogsCount,
      'items': resultData,
    };
  }

  async findUserById(id: string): Promise<UserViewDto | null> {
    isObjectId(id);
    const result = await UserModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!result) {
      return null;
    }

    return new UserViewDto(result);
  }

  async findAuthUserById(id: string): Promise<UserViewAuthDto | null> {
    isObjectId(id);
    const result = await UserModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!result) {
      return null;
    }

    return new UserViewAuthDto(result);
  }
}

export const usersQueryRepository = new UsersQueryRepository();
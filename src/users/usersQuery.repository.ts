import { usersCollection } from '../db';
import { UserViewDto } from './dto/usersView.dto';
import { UserViewAuthDto } from './dto/userViewAuth.dto';
import { ERROR_MESSAGE, userQueryStringType } from '../common/types/types';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { ObjectId } from 'mongodb';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { isObjectId } from '../common/adapters/mongodb.service';

class UsersQueryRepository {
  async findUsers(queryString: userQueryStringType) {
    const loginFilter = queryString.searchLoginTerm ? { login: { $regex: queryString.searchLoginTerm, $options: 'i', }, } : {};
    const emailFilter = queryString.searchEmailTerm ? { email: { $regex: queryString.searchEmailTerm, $options: 'i', }, } : {};
    const searchString = { $or: [loginFilter, emailFilter] };
    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const result = await usersCollection
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .toArray();

    const blogsCount = await usersCollection.countDocuments(queryHelper.filter.search);
    const resultData = result.map((item) => new UserViewDto(item));

    return {
      'pagesCount': Math.ceil(blogsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': blogsCount,
      'items': resultData,
    };
  }

  async findById(id: string, type: boolean = false) {
    await isObjectId(id);
    const result = await usersCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND, []);
    }

    if (type) {
      return new UserViewAuthDto(result);
    }

    return new UserViewDto(result);
  }
}

export const usersQueryRepository = new UsersQueryRepository();
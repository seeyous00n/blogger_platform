import { usersCollection } from '../db';
import { UserViewDto } from '../dtos/users-view-dto';
import { userQueryStringType } from '../types/types';
import { BaseQueryHelper } from '../filters/base-query-helper';

class UsersQueryRepository {
  async findUsers(queryString: userQueryStringType) {
    const loginFilter = queryString.searchLoginTerm ? { login: { $regex: queryString.searchLoginTerm, $options: 'i', }, } : {};
    const emailFilter = queryString.searchEmailTerm ? { email: { $regex: queryString.searchEmailTerm, $options: 'i', }, } : {};
    const searchString = { $or: [loginFilter, emailFilter] };
    const queryHelper = new BaseQueryHelper(queryString, searchString);

    const result = await usersCollection
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .toArray();

    const blogsCount = await usersCollection.countDocuments(queryHelper.filter.search);
    const resultData = result.map((item) => new UserViewDto(item));

    return {
      'pagesCount': Math.ceil(blogsCount / Number(queryHelper.pageSize)),
      'page': Number(queryHelper.pageNumber),
      'pageSize': Number(queryHelper.pageSize),
      'totalCount': blogsCount,
      'items': resultData,
    };
  }
}

export const usersQueryRepository = new UsersQueryRepository();
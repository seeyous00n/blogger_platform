import { UserQueryHelper } from '../filters/user-query-helper';
import { usersCollection } from '../db';
import { UserViewDto } from '../dtos/users-view-dto';
import { userQueryStringType } from '../types/types';

class UsersQueryRepository {
  async findUsers(queryString: userQueryStringType) {
    const userQueryHelper = new UserQueryHelper(queryString);
    const filter = userQueryHelper.parsFilter();
    const result = await usersCollection
      .find(filter.search)
      .sort(filter.sort as {})
      .skip(filter.skip)
      .limit(filter.limit)
      .toArray();

    const blogsCount = await usersCollection.countDocuments(filter.search);
    const resultData = result.map((item) => new UserViewDto(item));

    return {
      'pagesCount': Math.ceil(blogsCount / Number(userQueryHelper.pageSize)),
      'page': Number(userQueryHelper.pageNumber),
      'pageSize': Number(userQueryHelper.pageSize),
      'totalCount': blogsCount,
      'items': resultData,
    };
  }
}

export const usersQueryRepository = new UsersQueryRepository();
import { postsCollection } from '../db';
import { PostsViewDto } from './dto/postsView.dto';
import { NotFoundError } from '../common/errorHandler';
import { ERROR_MESSAGE, queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { isObjectId } from '../common/adapters/mongodb.service';

class PostsQueryRepository {
  async findPosts(queryString: queryStringType, id?: ObjectId) {
    const searchString = id ? { blogId: id } : queryString.searchNameTerm ? { name: { $regex: queryString.searchNameTerm, $options: 'i', }, } : {};
    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const result = await postsCollection
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .toArray();

    const postsCount = await postsCollection.countDocuments(queryHelper.filter.search);
    const posts = result.map((item) => new PostsViewDto(item));

    return {
      'pagesCount': Math.ceil(postsCount / Number(queryHelper.pageSize)),
      'page': Number(queryHelper.pageNumber),
      'pageSize': Number(queryHelper.pageSize),
      'totalCount': postsCount,
      'items': posts,
    };
  }

  async findById(id: string) {
    await isObjectId(id);
    const result = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return new PostsViewDto(result);
  }
}

export const postsQueryRepository = new PostsQueryRepository();
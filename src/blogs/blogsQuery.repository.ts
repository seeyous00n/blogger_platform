import { blogsCollection } from '../db';
import { NotFoundError } from '../common/errorHandler';
import { BlogsViewDto } from './dto/blogsView.dto';
import { ERROR_MESSAGE, queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { isObjectId } from '../common/adapters/mongodb.service';

class BlogsQueryRepository {
  async findBlogs(queryString: queryStringType) {
    const searchString = queryString.searchNameTerm ? { name: { $regex: queryString.searchNameTerm, $options: 'i', }, } : {};
    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const result = await blogsCollection
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .toArray();

    const blogsCount = await blogsCollection.countDocuments(queryHelper.filter.search);
    const blogs = result.map((item) => new BlogsViewDto(item));

    return {
      'pagesCount': Math.ceil(blogsCount / Number(queryHelper.pageSize)),
      'page': Number(queryHelper.pageNumber),
      'pageSize': Number(queryHelper.pageSize),
      'totalCount': blogsCount,
      'items': blogs,
    };
  }

  async findById(id: string) {
    await isObjectId(id);
    const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    return new BlogsViewDto(result);
  }
}

export const blogsQueryRepository = new BlogsQueryRepository();
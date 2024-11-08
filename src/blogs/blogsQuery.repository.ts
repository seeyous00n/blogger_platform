import { blogsCollection } from '../db';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { BlogsViewDto } from './dto/blogsView.dto';
import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { isObjectId } from '../common/adapters/mongodb.service';
import { BlogsViewModel } from './models/blogsView.model';

class BlogsQueryRepository {
  async findBlogs(queryString: queryStringType): Promise<BlogsViewModel> {
    const searchString = queryString.searchNameTerm ? {
      name: {
        $regex: queryString.searchNameTerm,
        $options: 'i',
      },
    } : {};
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
      'pagesCount': Math.ceil(blogsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': blogsCount,
      'items': blogs,
    };
  }

  async findById(id: string): Promise<BlogsViewDto | null> {
    isObjectId(id);
    const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return null;
    }

    return new BlogsViewDto(result);
  }
}

export const blogsQueryRepository = new BlogsQueryRepository();
import { blogsCollection } from '../db';
import { NotFoundError } from '../utils';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { QueryStringFilter } from '../filters/query-string-filter';
import { ERROR_MESSAGE, queryStringType } from '../types/types';
import { ObjectId } from 'mongodb';
import { sharedRepository } from './shared-repository';

class BlogsQueryRepository {
  async findBlogs(queryString: queryStringType) {
    const supportFilter = new QueryStringFilter(queryString);
    const filter = supportFilter.prepareQueryString();
    const result = await sharedRepository.findData(blogsCollection, filter);
    const blogsCount = await blogsCollection.countDocuments(filter.search);

    return supportFilter.prepareDataAnswer(blogsCount, result);
  }

  async findById(id: string) {
    const result = await blogsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }
    return new BlogsViewDto(result);
  }
}

export const blogsQueryRepository = new BlogsQueryRepository();
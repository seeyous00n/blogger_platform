import { blogsCollection } from '../db';
import { NotFoundError } from '../utils/utils';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { ERROR_MESSAGE, queryStringType } from '../types/types';
import { ObjectId } from 'mongodb';
import { QueryHelper } from '../filters/query-helper';
import { dataMapper, prepareDataAnswer } from '../utils/map-data';

class BlogsQueryRepository {
  async findBlogs(queryString: queryStringType) {

    const queryHelper = new QueryHelper(queryString);
    const filter = queryHelper.parsFilter();
    const result = await blogsCollection
      .find(filter.search)
      .sort(filter.sort)
      .skip(filter.skip)
      .limit(filter.limit)
      .toArray();

    const blogsCount = await blogsCollection.countDocuments(filter.search);
    const blogs = dataMapper(result)

    return prepareDataAnswer(blogs, blogsCount, queryHelper)
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
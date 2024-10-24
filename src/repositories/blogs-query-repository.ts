import { BlogType } from '../types/blog-types';
import { blogsCollection } from '../db';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';
import { BlogsViewDto } from '../dtos/blogs-view-dto';
import { QueryStringFilter } from '../filters/query-string-filter';
import { queryStringType } from '../types/types';
import { ObjectId } from 'mongodb';
import { QueryViewModel } from '../models/ViewQueryModel';
import { sharedRepository } from './shared-repository';

class BlogsQueryRepository {
  async findBlogs(queryString: queryStringType): Promise<QueryViewModel> {
    const supportFilter = new QueryStringFilter(queryString);
    const filter = supportFilter.prepareQueryString();
    const result = await sharedRepository.findData(blogsCollection, filter);
    const blogsCount = await blogsCollection.countDocuments(filter.search);

    return supportFilter.prepareDataAnswer(blogsCount, result);
  }

  async findById(_id: string): Promise<BlogType> {
    const id = new ObjectId(_id);
    const result = await blogsCollection.findOne({ id });
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }

    return new BlogsViewDto(result!);
  }
}

export const blogsQueryRepository = new BlogsQueryRepository();
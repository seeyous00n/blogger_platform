import { BlogsViewDto } from './dto/blogsView.dto';
import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { isObjectId } from '../common/adapters/mongodb.service';
import { BlogsViewModel } from './models/blogsView.model';
import { BlogModel } from "../common/db/schemes/blogSchema";

class BlogsQueryRepository {
  async findBlogs(queryString: queryStringType): Promise<BlogsViewModel> {
    const searchString = queryString.searchNameTerm ? {
      name: {
        $regex: queryString.searchNameTerm,
        $options: 'i',
      },
    } : {};
    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const result = await BlogModel
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort as any) // Delete as any !!!!
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .lean();

    const blogsCount = await BlogModel.countDocuments(queryHelper.filter.search);
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
    const result = await BlogModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!result) {
      return null;
    }

    return new BlogsViewDto(result);
  }
}

export const blogsQueryRepository = new BlogsQueryRepository();
import { PostsViewDto } from './dto/postsView.dto';
import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentsViewModel } from './models/postsView.model';
import { PostModel } from "../common/db/schemes/postSchema";

export class PostsQueryRepository {
  async findPosts(queryString: queryStringType, id?: string): Promise<CommentsViewModel> {
    const searchString = id ? { blogId: id } : queryString.searchNameTerm ? {
      name: {
        $regex: queryString.searchNameTerm,
        $options: 'i',
      },
    } : {};
    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const result = await PostModel
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .lean();

    const postsCount = await PostModel.countDocuments(queryHelper.filter.search);
    const posts = result.map((item) => new PostsViewDto(item));

    return {
      'pagesCount': Math.ceil(postsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': postsCount,
      'items': posts,
    };
  }

  async findById(id: string): Promise<PostsViewDto | null> {
    isObjectId(id);
    const result = await PostModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!result) {
      return null;
    }

    return new PostsViewDto(result);
  }
}
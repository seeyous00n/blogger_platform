import { postsCollection } from '../db';
import { PostsViewDto } from './dto/postsView.dto';
import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentsViewModel } from './models/postsView.model';

class PostsQueryRepository {
  async findPosts(queryString: queryStringType, id?: string): Promise<CommentsViewModel> {
    const searchString = id ? { blogId: id } : queryString.searchNameTerm ? {
      name: {
        $regex: queryString.searchNameTerm,
        $options: 'i',
      },
    } : {};
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
      'pagesCount': Math.ceil(postsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': postsCount,
      'items': posts,
    };
  }

  async findById(id: string): Promise<PostsViewDto | null> {
    isObjectId(id);
    const result = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (!result) {
      return null;
    }

    return new PostsViewDto(result);
  }
}

export const postsQueryRepository = new PostsQueryRepository();
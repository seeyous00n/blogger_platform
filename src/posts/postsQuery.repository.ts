import { PostsViewDto } from './dto/postsView.dto';
import { queryStringType } from '../common/types/types';
import { ObjectId } from 'mongodb';
import { BaseQueryFieldsUtil } from '../common/utils/baseQueryFields.util';
import { isObjectId } from '../common/adapters/mongodb.service';
import { CommentsViewModel } from './models/postsView.model';
import { PostModel } from "../common/db/schemes/postSchema";
import { LikeHelper } from "../like/like.helper";

export class PostsQueryRepository {
  constructor(private likeHelper: LikeHelper) {
  }
  async findPosts(queryString: queryStringType, authorId: string | undefined, id?: string): Promise<CommentsViewModel> {
    const searchString = id ? { blogId: id } : queryString.searchNameTerm ? {
      name: {
        $regex: queryString.searchNameTerm,
        $options: 'i',
      },
    } : {};
    const queryHelper = new BaseQueryFieldsUtil(queryString, searchString);

    const posts = await PostModel
      .find(queryHelper.filter.search)
      .sort(queryHelper.filter.sort)
      .skip(queryHelper.filter.skip)
      .limit(queryHelper.filter.limit)
      .lean();

    const postsCount = await PostModel.countDocuments(queryHelper.filter.search);

    const postsWithLikes = await this.likeHelper.getPostsWithLikes(posts, authorId);

    const result = postsWithLikes.map((item) => new PostsViewDto(item));

    return {
      'pagesCount': Math.ceil(postsCount / queryHelper.pageSize),
      'page': queryHelper.pageNumber,
      'pageSize': queryHelper.pageSize,
      'totalCount': postsCount,
      'items': result,
    };
  }

  async findById(id: string, authorId?: string): Promise<PostsViewDto | null> {
    isObjectId(id);
    const post = await PostModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!post) {
      return null;
    }

    const PostWithLike = await this.likeHelper.getPostWithLike(post, authorId)

    return new PostsViewDto(PostWithLike);
  }
}
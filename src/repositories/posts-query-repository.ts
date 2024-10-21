import { PostType } from '../types/post-types';
import { postsCollection } from '../db';
import { PostsViewDto } from '../dtos/posts-view-dto';
import { setAndThrowError } from '../utils';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from '../settings';

class PostsQueryRepository {
  async findPosts() {
    const result = await postsCollection.find({}).toArray();

    return result.map(post => new PostsViewDto(post));
  }

  async findById(id: string): Promise<PostType> {
    const result = await postsCollection.findOne({ id });
    if (!result) {
      setAndThrowError({ message: HTTP_MESSAGE.NOT_FOUND, status: HTTP_STATUS_CODE.NOT_FOUND_404 });
    }

    return new PostsViewDto(result!);
  }
}

export const postsQueryRepository = new PostsQueryRepository();
import { PostCreateModel } from './models/postCreate.model';
import { PostUpdateModal } from './models/postUpdate.modal';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { BlogsRepository } from '../blogs/blogs.repository';
import { ObjectId } from 'mongodb';
import { PostCreateDto } from "./dto/postCreate.dto";
import { PostDocument } from "../common/db/schemes/postSchema";
import { PostsRepository } from "./posts.repository";
import { InputLikeStatusType } from "../comments/types/comment.types";
import { LikeService } from "../like/like.service";

export class PostService {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
    private likeService: LikeService) {
  }

  async findPostById(id: string): Promise<ObjectId> {
    const result = await this.postsRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    return result._id;
  }

  async createPost(post: PostCreateModel): Promise<PostDocument> {
    const dataBlog = await this.blogsRepository.findById(post.blogId.toString());
    if (!dataBlog) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    const newPost = new PostCreateDto({ ...post, blogName: dataBlog.name });
    return await this.postsRepository.createByData(newPost);
  }

  async updatePostById(id: string, data: PostUpdateModal): Promise<void> {
    await this.checkExistsPost(id);
    await this.postsRepository.updateById(id, data);
  }

  async deletePostById(id: string): Promise<void> {
    await this.checkExistsPost(id);
    await this.postsRepository.deleteById(id);
  }

  async checkExistsPost(id: string): Promise<void> {
    const result = await this.postsRepository.findById(id);
    if (!result) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }
  }

  async like(data: InputLikeStatusType): Promise<void> {
    const post = await this.postsRepository.findById(data.parentId);
    if (!post) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND);
    }

    await this.likeService.createLike(data)
  }
}
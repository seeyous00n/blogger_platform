import { postsRepository } from '../posts/posts.repository';
import { ForbiddenError, NotFoundError } from '../common/errorHandler';
import { ERROR_MESSAGE } from '../common/types/types';
import { commentRepository } from './comment.repository';
import { CommentUpdateModel } from './models/CommentUpdate.model';
import { CommentCreateInputModel } from './models/CommentCreateInput.model';
import { CommentEntityType } from './types/comment.types';

class CommentService {
  async createComment(data: CommentCreateInputModel) {
    const post = await postsRepository.findById(data.postId);
    if (!post) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    const newComment: CommentEntityType = {
      postId: data.postId,
      content: data.comment,
      commentatorInfo: {
        userId: data.userId,
        userLogin: 'string',
      },
      createdAt: new Date().toISOString(),
    };

    return await commentRepository.createByData(newComment);
  }

  async updateCommentById(id: string, data: CommentUpdateModel, userId: string) {
    await this.isOwnerComment(id, userId);
    await commentRepository.updateById(id, data);
  }

  async deleteCommentById(id: string, userId: string) {
    await this.isOwnerComment(id, userId);
    await commentRepository.deleteById(id);
  }

  async isOwnerComment(commentId: string, userId: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND);
    }

    const result = await commentRepository.findByIdAndUserId(commentId, userId);
    if (!result) {
      throw new ForbiddenError(ERROR_MESSAGE.FORBIDDEN);
    }
  }
}

export const commentService = new CommentService();
import { postsRepository } from '../posts/posts.repository';
import { CustomError, TYPE_ERROR } from '../common/errorHandler';
import { ERROR_MESSAGE } from '../common/types/types';
import { commentRepository } from './comment.repository';
import { CommentUpdateModel } from './models/CommentUpdate.model';
import { CommentCreateInputModel } from './models/CommentCreateInput.model';
import { CommentEntityType } from './types/comment.types';

class CommentService {
  async createComment(data: CommentCreateInputModel) {
    const post = await postsRepository.findById(data.postId);
    if (!post) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND, []);
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
    await this.ownerCommentOrError(id, userId);
    await commentRepository.updateById(id, data);
  }

  async deleteCommentById(id: string, userId: string) {
    await this.ownerCommentOrError(id, userId);
    await commentRepository.deleteById(id);
  }

  async ownerCommentOrError(commentId: string, userId: string) {
    const comment = await commentRepository.findById(commentId);
    if (!comment) {
      throw new CustomError(TYPE_ERROR.NOT_FOUND, ERROR_MESSAGE.NOT_FOUND, []);
    }

    const result = await commentRepository.findByIdAndUserId(commentId, userId);
    if (!result) {
      throw new CustomError(TYPE_ERROR.FORBIDDEN_ERROR, ERROR_MESSAGE.FORBIDDEN, []);
    }
  }
}

export const commentService = new CommentService();
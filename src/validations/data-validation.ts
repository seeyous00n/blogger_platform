import { body } from 'express-validator';
import { blogService } from '../services/blog-service';
import { errorsValidationMiddleware } from '../middlewares/errors-validation-middleware';

const blogIdValidator = async (value: string) => {
  const blog = blogService.getBlogById(+value);
  if (!blog) {
    throw new Error('blog ID not found');
  }
};

const nameValidator = body('name').isString().trim().notEmpty().escape().isLength({ max: 15 });
const descriptionValidator = body('description').isString().trim().notEmpty().escape().isLength({ max: 500 });
const websiteUrlValidator = body('websiteUrl').isString().trim().notEmpty().isURL().isLength({ max: 100 });

const titleValidator = body('title').isString().trim().notEmpty().escape().isLength({ max: 30 });
const shortDescriptionValidator = body('shortDescription').isString().trim().notEmpty().escape().isLength({ max: 100 });
const contentValidator = body('content').isString().trim().notEmpty().escape().isLength({ max: 1000 });
const isBlogId = body('blogId').custom(blogIdValidator);

export const blogDataValidation = [
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  errorsValidationMiddleware,
];

export const postDataValidation = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  isBlogId,
  errorsValidationMiddleware,
];

export const postDataUpdateValidation = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  isBlogId,
  errorsValidationMiddleware,
];

import { body } from 'express-validator';
import { errorsValidationMiddleware } from '../middlewares/errors-validation-middleware';
import { blogsRepository } from '../repositories/blogs-repository';
import { ObjectId } from 'mongodb';

const BLOG_ID_ERROR_MESSAGE = 'Blog ID not found';

const blogIdValidator = async (value: string) => {
  const blog = await blogsRepository.findById(new ObjectId(value));
  if (!blog) {
    throw new Error(BLOG_ID_ERROR_MESSAGE);
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

export const postDataValidationWithoutId = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  errorsValidationMiddleware,
];

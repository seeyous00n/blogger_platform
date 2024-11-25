import { body } from 'express-validator';
import { inputValidation } from './input.validation';
import { blogsRepository } from '../../blogs/blogs.repository';

const BLOG_ID_ERROR_MESSAGE = 'Blog ID not found';

const blogIdValidator = async (value: string): Promise<void> => {
  const blog = await blogsRepository.findById(value);
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

const loginValidator = body('login').isString().trim().isLength({ min: 3, max: 10 }).matches(/^[a-zA-Z0-9_-]*$/);
export const emailValidator = body('email').isString().trim().matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
const passwordValidator = body('password').isString().trim().isLength({ min: 6, max: 20 });
export const newPasswordValidator = body('newPassword').isString().trim().isLength({ min: 6, max: 20 });
const loginOrEmailValidator = body('loginOrEmail').isString().trim().notEmpty();

export const confirmationCodeValidator = body('code').isString().trim().notEmpty();
export const commentContentValidator = body('content').isString().trim().isLength({ min: 20, max: 300 });

export const blogDataValidation = [
  nameValidator,
  descriptionValidator,
  websiteUrlValidator,
  inputValidation,
];

export const postDataValidation = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  isBlogId,
  inputValidation,
];

export const postDataValidationWithoutId = [
  titleValidator,
  shortDescriptionValidator,
  contentValidator,
  inputValidation,
];

export const userDataValidation = [
  loginValidator,
  emailValidator,
  passwordValidator,
  inputValidation,
];

export const authDataValidation = [
  loginOrEmailValidator,
  passwordValidator,
];

export const registrationDataValidation = [
  loginValidator,
  emailValidator,
  passwordValidator,
  inputValidation,
];
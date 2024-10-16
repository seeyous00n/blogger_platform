import { config } from 'dotenv';

config();

export const SETTINGS = {
  PORT: process.env.PORT || 3003,
};

export const ROUTER_PATHS = {
  BLOGS: '/blogs',
  POSTS: '/posts',
  TESTING: '/testing/all-data',
};

export const HTTP_STATUS_CODE = {
  'OK_200': 200,
  'CREATED_201': 201,
  'NO_CONTENT_204': 204,
  'BAD_REQUEST_400': 400,
  'NOT_FOUND_404': 404,
  'SERVER_ERROR_500': 500,
  'UNAUTHORIZED_401': 401,
};

export const HTTP_MESSAGE = {
  'BAD_REQUEST': 'Bad request',
  'ID_DOESNT_EXIST': `id doesn't exist`,
  'NOT_FOUND': 'Not Found',
  'SERVER_ERROR': 'Internal Server Error',
  'UNAUTHORIZED': 'Unauthorized',
};
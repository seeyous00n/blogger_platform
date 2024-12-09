import { config } from 'dotenv';

config();

export const SETTINGS = {
  PORT: process.env.PORT || 3003,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  DB_NAME: 'blogger_platform',
  auth: {
    name: process.env.LOG || 'admin',
    password: process.env.PASS || 'qwerty',
  },
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  SMTP_EMAIL: process.env.SMTP_EMAIL,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  API_URL: process.env.API_URL || process.env.VERCEL_URI || process.env.RENDER_URI,
};

export const ROUTER_PATHS = {
  BLOGS: '/blogs',
  POSTS: '/posts',
  AUTH: '/auth',
  USERS: '/users',
  COMMENTS: '/comments',
  SECURITY: '/security',
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
  'FORBIDDEN_403': 403,
  'TOO_MANY_REQUESTS_429': 429,
};

export const HTTP_MESSAGE = {
  'BAD_REQUEST': 'Bad request',
  'ID_DOESNT_EXIST': `id doesn't exist`,
  'NOT_FOUND': 'Not Found',
  'SERVER_ERROR': 'Internal Server Error',
  'UNAUTHORIZED': 'Unauthorized',
};
import { app } from '../../src/app';
import { agent } from 'supertest';
import { BASIC, convertToBase64, LOG, PASS } from '../../src/middlewares/auth-validation-middleware';

export const req = agent(app);

export const authorized = { 'Authorization': `${BASIC} ${convertToBase64()}` };

export const mokDataCreateBlog = {
  name: 'blog 1',
  description: 'blog 1',
  websiteUrl: 'https://EASajIWEY5VhOmcF.com',
};

export const mokBadDataCreateBlog = {
  name: '',
  description: '',
  websiteUrl: 'https://EASajIWEY5VhOmcF.eTRteOr_tm-QPIZzFSb95Jh5JYrUDBSU2RvpXgWadWQfhvMJxHwRQoZfuy-g.aEAHuT5QM7UaG7',
};

export const mokDataUpdateBlog = {
  name: 'blog 1 new',
  description: 'blog 1 new',
  websiteUrl: 'https://EASajIWEYOmcFnew.comn',
};

export const mokDataCreatePost = {
  title: 'post 1',
  shortDescription: 'post 1',
  content: 'post 1',
};

export const mokDataUpdatePost = {
  title: 'post 1 new',
  shortDescription: 'post 1 new',
  content: 'post 1 new',
};
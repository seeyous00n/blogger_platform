import { query } from 'express-validator';

const searchNameTerm = query('searchNameTerm').default('');
const sortBy = query('sortBy').default('createdAt');
const sortDirection = query('sortDirection').default('desc');
const pageNumber = query('pageNumber').toInt().default(1);
const pageSize = query('pageSize').toInt().default(10);

const searchEmailTerm = query('searchEmailTerm').default('');
const searchLoginTerm = query('searchLoginTerm').default('');

export const queryStringPaginationValidation = [
  searchNameTerm, sortBy, sortDirection, pageNumber, pageSize,
];

export const queryStringPaginationUserValidation = [
  sortBy, sortDirection, pageNumber, pageSize, searchEmailTerm, searchLoginTerm
];

export const queryStringPaginationPostsValidation = [
  pageNumber, pageSize, sortBy, sortDirection
];
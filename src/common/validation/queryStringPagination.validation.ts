import { query } from 'express-validator';

const searchNameTerm = query('searchNameTerm').toInt().default('');
const sortBy = query('sortBy').default('createdAt');
const sortDirection = query('websiteUrl').default('desc');
const pageNumber = query('pageNumber').toInt().default(1);
const pageSize = query('pageSize').toInt().default(10);

export const queryStringPaginationValidation = [
  searchNameTerm, sortBy, sortDirection, pageNumber, pageSize,
];
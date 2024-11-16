import { Request } from 'express';

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T, Q> = Request<T, {}, {}, Q>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

type errorsMessagesType = {
  message: string,
  field: string,
}

export type resultErrorsType = {
  errorsMessages: errorsMessagesType[]
}

export type queryStringType = {
  searchNameTerm?: string | null,
  sortBy: string,
  sortDirection: 'asc' | 'desc',
  pageNumber: string,
  pageSize: string,
}

export type userQueryStringType = queryStringType & {
  searchLoginTerm: string | null,
  searchEmailTerm: string | null,
}

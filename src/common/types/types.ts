import { Request } from 'express';

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T, Q> = Request<T, {}, {}, Q>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>
export type RequestOnlyQuery<Q> = Request<{}, {}, {}, Q>
export type RequestBase = Request<{}, {}, {}, {}>

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

export type userQueryStringType = Omit<queryStringType, 'searchNameTerm'> & {
  searchLoginTerm: string | null,
  searchEmailTerm: string | null,
}

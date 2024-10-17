import { Request } from 'express';

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

type errorsMessagesType = {
  message: string,
  field: string,
}

export type resultErrorsType = {
  errorsMessages: errorsMessagesType[]
}
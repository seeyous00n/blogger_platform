import { Response } from 'express';
import { HTTP_MESSAGE, HTTP_STATUS_CODE } from './settings';

export const throwError = ({ message, status }: { message: string, status: number }) => {
  const err = { message, status };
  throw new Error(JSON.stringify(err));
};

// export const sendError = (e: any, res: Response) => {
//   const err = JSON.parse(e.message);
//   res.status(err.status).json(err.message);
// };

// export const sendError = (res: Response, message: string, status: number) => {
//   res.status(status).json(message);
// };
export class NotFoundError extends Error {
  constructor(message: string) {
    super();
    this.message = message;
  }
}

export const sendError = (error: any, res: Response) => {
  if (error instanceof NotFoundError) {
    res.status(HTTP_STATUS_CODE.NOT_FOUND_404).json(error.message);
    return;
  }
  res.status(HTTP_STATUS_CODE.SERVER_ERROR_500).json(HTTP_MESSAGE.SERVER_ERROR);
};


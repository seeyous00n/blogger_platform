export declare global {
  namespace Express {
    export interface Request {
      user: { userId: string };
      authorizedUserId: string | undefined;
    }
  }
}
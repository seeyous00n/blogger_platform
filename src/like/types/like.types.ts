export type ResultLikeType = {
  likesCount: number;
  dislikesCount: number;
}

export type LikeWithMyStatusType = ResultLikeType & { myStatus: string }
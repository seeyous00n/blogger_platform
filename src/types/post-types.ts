export type PostType = {
  id: string,
  title: string,
  shortDescription: string,
  content: string,
  blogId: string,
  blogName: string,
  createdAt: string
}

export type PostsWithQuery = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: PostType[]
}
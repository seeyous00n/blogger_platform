export type BlogType = {
  id: string,
  name: string,
  description: string,
  websiteUrl: string,
  createdAt: string,
  isMembership: boolean
}

export type BlogsWithQuery = {
  pagesCount: number,
  page: number,
  pageSize: number,
  totalCount: number,
  items: BlogType[]
}
export type ParsFilterType = {
  search: object,
  sort: { [p: string]: number },
  skip: number,
  limit: number,
}
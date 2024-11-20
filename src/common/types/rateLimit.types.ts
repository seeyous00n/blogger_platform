export type RateLimitType = {
  IP: string,
  URL: string,
  date: Date
}

export type GetVisitorsType = Omit<RateLimitType, 'date'>
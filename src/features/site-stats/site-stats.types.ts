export type SiteStats = {
  visitors: number;
  pageViews: number;
};

export type SiteStatsViewRequest = {
  visitorId: string;
  path: string;
};

CREATE TABLE IF NOT EXISTS site_visitors (
  visitor_hash TEXT PRIMARY KEY,
  first_seen_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS site_daily_stats (
  date TEXT PRIMARY KEY,
  page_views INTEGER NOT NULL DEFAULT 0 CHECK (page_views >= 0)
);

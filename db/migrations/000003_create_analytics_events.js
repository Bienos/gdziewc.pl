exports.up = (pgm) => pgm.sql(`
  CREATE TABLE analytics_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL CHECK (name IN ('location_requested', 'nearby_loaded', 'view_changed', 'filter_toggled', 'detail_opened', 'navigation_opened', 'report_submitted')),
    result text CHECK (result IS NULL OR result IN ('success', 'empty', 'error')),
    view text CHECK (view IS NULL OR view IN ('map', 'list')),
    filter_key text CHECK (filter_key IS NULL OR filter_key IN ('openNow', 'free', 'wheelchair', 'babyChanging', 'open24h')),
    created_at timestamptz NOT NULL DEFAULT now()
  );
`);
exports.down = (pgm) => pgm.sql(`DROP TABLE IF EXISTS analytics_events;`);

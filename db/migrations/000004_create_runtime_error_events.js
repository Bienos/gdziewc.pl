exports.up = (pgm) => pgm.sql(`
  CREATE TABLE runtime_error_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL CHECK (code IN ('nearby_failed', 'report_failed', 'analytics_failed')),
    surface text NOT NULL CHECK (surface IN ('location', 'report', 'analytics')),
    created_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX runtime_error_events_created_at_idx ON runtime_error_events (created_at);
`);

exports.down = (pgm) => pgm.sql(`DROP TABLE IF EXISTS runtime_error_events;`);

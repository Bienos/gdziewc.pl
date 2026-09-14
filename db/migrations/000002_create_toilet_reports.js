exports.up = (pgm) => {
  pgm.sql(`
    CREATE TABLE toilet_reports (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      toilet_id uuid NOT NULL REFERENCES toilets(id) ON DELETE CASCADE,
      issue_type text NOT NULL CHECK (issue_type IN ('closed', 'missing', 'hours', 'price', 'access', 'other')),
      note text CHECK (note IS NULL OR char_length(note) BETWEEN 1 AND 500),
      status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX toilet_reports_toilet_id_created_at_idx ON toilet_reports (toilet_id, created_at DESC);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TABLE IF EXISTS toilet_reports;`);
};

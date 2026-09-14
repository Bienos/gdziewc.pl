exports.up = (pgm) => {
  pgm.sql(`
    CREATE EXTENSION IF NOT EXISTS postgis;

    CREATE TABLE ingestion_runs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      source_name text NOT NULL,
      source_dataset_updated_at timestamptz,
      started_at timestamptz NOT NULL DEFAULT now(),
      completed_at timestamptz,
      status text NOT NULL DEFAULT 'running'
        CHECK (status IN ('running', 'succeeded', 'failed')),
      records_fetched integer NOT NULL DEFAULT 0 CHECK (records_fetched >= 0),
      records_created integer NOT NULL DEFAULT 0 CHECK (records_created >= 0),
      records_updated integer NOT NULL DEFAULT 0 CHECK (records_updated >= 0),
      records_rejected integer NOT NULL DEFAULT 0 CHECK (records_rejected >= 0),
      error_summary text
    );

    CREATE TABLE toilets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      address text,
      district text,
      geom geography(Point, 4326) NOT NULL,
      access_state text NOT NULL DEFAULT 'unknown'
        CHECK (access_state IN ('public', 'restricted', 'not_public', 'unknown')),
      price_state text NOT NULL DEFAULT 'unknown'
        CHECK (price_state IN ('free', 'paid', 'unknown')),
      price_amount_minor integer CHECK (price_amount_minor IS NULL OR price_amount_minor >= 0),
      currency char(3),
      open_24h boolean,
      opening_hours_raw text,
      opening_hours_normalized jsonb,
      wheelchair_state text NOT NULL DEFAULT 'unknown'
        CHECK (wheelchair_state IN ('accessible', 'limited', 'not_accessible', 'unknown')),
      baby_changing_state text NOT NULL DEFAULT 'unknown'
        CHECK (baby_changing_state IN ('available', 'limited', 'unavailable', 'unknown')),
      unisex_state text NOT NULL DEFAULT 'unknown'
        CHECK (unisex_state IN ('yes', 'no', 'unknown')),
      seasonal boolean,
      canonical_status text NOT NULL DEFAULT 'active'
        CHECK (canonical_status IN ('active', 'temporarily_closed', 'removed')),
      confidence_level text NOT NULL DEFAULT 'low'
        CHECK (confidence_level IN ('high', 'medium', 'low')),
      confidence_score smallint
        CHECK (confidence_score IS NULL OR confidence_score BETWEEN 0 AND 100),
      verified_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE INDEX toilets_geom_gist_idx ON toilets USING gist (geom);

    CREATE TABLE toilet_source_records (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      source_name text NOT NULL,
      source_record_id text NOT NULL,
      toilet_id uuid REFERENCES toilets(id) ON DELETE SET NULL,
      source_url text,
      source_element_type text,
      raw_payload jsonb NOT NULL,
      normalized_payload jsonb NOT NULL,
      licence_id text NOT NULL,
      licence_url text NOT NULL,
      attribution_text text NOT NULL,
      source_updated_at timestamptz,
      source_dataset_updated_at timestamptz,
      fetched_at timestamptz NOT NULL,
      source_confidence text NOT NULL DEFAULT 'low'
        CHECK (source_confidence IN ('high', 'medium', 'low')),
      ingestion_run_id uuid REFERENCES ingestion_runs(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      UNIQUE (source_name, source_record_id)
    );

    CREATE INDEX toilet_source_records_toilet_id_idx
      ON toilet_source_records (toilet_id);
    CREATE INDEX toilet_source_records_ingestion_run_id_idx
      ON toilet_source_records (ingestion_run_id);
  `);
};

exports.down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS toilet_source_records;
    DROP TABLE IF EXISTS toilets;
    DROP TABLE IF EXISTS ingestion_runs;
  `);
};

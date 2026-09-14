# GdzieKibel.pl

Mobile-first Warsaw toilet finder with a private click-to-locate journey, real PostGIS nearby search, map/list results, details, walking navigation and incorrect-data reports. The initial reproducible data source is a validated, attributed Warsaw OpenStreetMap snapshot.

The interactive map uses MapLibre and defaults to OpenFreeMap Liberty. Map code and external map traffic start only after the user shares location or deliberately opens manual browsing. `NEXT_PUBLIC_MAP_STYLE_URL` can select another approved HTTPS MapLibre style; do not point it at the public OpenStreetMap tile servers.

## Requirements

- Node.js 22+ (pinned in `.nvmrc`)
- PostgreSQL database with the PostGIS extension, only when running database commands

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run build
npm run test:e2e
npm run test:performance
npm run audit:dependencies
```

To verify the configured database has PostGIS, copy `.env.example` to `.env.local`, set `DATABASE_URL`, then run:

```bash
npm run db:check
```

SQL migrations are versioned in `db/migrations/` and run with `npm run db:migrate`. `npm run test:integration` verifies the migrated schema when `TEST_DATABASE_URL` or `DATABASE_URL` points to a disposable PostGIS database.

To import the committed Warsaw OSM verification snapshot:

```bash
npm run db:ingest:osm-warsaw -- --file data/osm/warsaw-toilets-2026-09-13.json.gz
```

The command requires `DATABASE_URL`. See `data/osm/README.md` for provenance, licence, checksum, and the explicitly manual live-fetch mode.

## Deployment

The app is Vercel-compatible without custom adapters. Import the repository into Vercel, set `DATABASE_URL` through its secret store, and use the automatically generated preview deployment for pull-request checks. If overriding the map provider, set `NEXT_PUBLIC_MAP_STYLE_URL` before building and add its required origins to the CSP. Browser-exposed paid-provider keys must be domain-restricted. Production promotion remains an explicit release action.

Before public staging, add Vercel WAF limits for the four `/api/` POST routes. The application already rejects foreign/non-JSON/oversized bodies and has a bounded, privacy-safe per-instance fallback; the edge rule supplies durable distributed enforcement.

Browser smoke tests remain local until the project has a stable hosted preview or a CI browser-install step.

## Staging release

Use a separate HTTPS deployment and PostGIS database for staging. The complete
environment, migration, import, smoke-test, observability and rollback process
is in [`docs/STAGING_RELEASE.md`](docs/STAGING_RELEASE.md). Once a stable URL
exists, run:

```bash
STAGING_BASE_URL=https://your-staging-host.example npm run test:staging
```

The staging smoke check is deliberately blocked for missing, HTTP or localhost
URLs. It does not submit reports and intercepts telemetry writes while it
checks the public shell plus the manual-map/nearby-results journey.

OpenFreeMap is an external map service used only after map activation. Its public service has no SLA. The provider/CDN receives ordinary tile requests and network metadata for the viewed area; GdzieKibel.pl does not add raw browser latitude/longitude to provider URLs. The list, detail and navigation journeys remain available if the basemap fails. See `docs/adr/0002-map-renderer-and-default-tile-provider.md`.

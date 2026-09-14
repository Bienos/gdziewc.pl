# Staging release runbook

This runbook verifies a release candidate in a separate, disposable staging
environment. It does not authorise a production deployment.

## Required staging boundary

- A dedicated Vercel staging/preview project or an equivalent HTTPS deployment.
- A dedicated managed PostgreSQL database with PostGIS; do not reuse production
  data or credentials.
- A database connection that requires TLS (`sslmode=require` or the managed
  provider equivalent).
- One short-lived migration/import credential and a separate application
  credential. The application credential receives only the table/schema
  privileges needed by the current API and must not create extensions, roles or
  databases.
- Vercel (or equivalent edge) rate limits for `POST /api/toilets/nearby`,
  `POST /api/toilet-reports`, `POST /api/analytics`, and `POST /api/errors`.
  The application limiter is a fallback, not durable distributed protection.

Store `DATABASE_URL` only in the hosting secret store. Set
`NEXT_PUBLIC_MAP_STYLE_URL` only when replacing the default style with an
approved HTTPS MapLibre provider; browser-visible provider keys must be
domain-restricted.

## Release sequence

1. Record the immutable source revision and the exact staging URL in the
   release ticket. Do not release an untraceable working directory.
2. Provision the isolated database and verify it has no production data.
3. With the temporary migration credential, run `npm run db:check`, then review
   the pending SQL with:

   ```bash
   node-pg-migrate up -m db/migrations --dry-run
   ```

4. Run `npm run db:migrate`. The migration tool uses a transaction and a lock;
   stop on any failure. Do not use `--fake` or manually edit schema state.
5. Import the verified snapshot using the staging migration/import credential:

   ```bash
   npm run db:ingest:osm-warsaw -- --file data/osm/warsaw-toilets-2026-09-13.json.gz
   ```

   Record the ingestion counts and confirm rejected records are investigated.
6. Create/rotate the runtime credential with the staging-only helper, then
   replace the hosting runtime secret with its output. The helper grants the
   application only the currently required reads and inserts; it never grants
   schema, extension, role, update or delete privileges.

   ```bash
   STAGING_APP_DATABASE_URL_FILE=/secure/temporary/app-url \
     npm run db:provision:staging-app-role
   ```

   Keep the output file out of the repository and delete it immediately after
   adding its value to the hosting secret store as `DATABASE_URL`. Deploy the
   recorded revision and confirm the deployment is HTTPS-only.
7. Configure the four edge rate-limit rules before exposing the URL beyond the
   release team.
8. Run the non-writing browser smoke test:

   ```bash
   STAGING_BASE_URL=https://your-staging-host.example npm run test:staging
   ```

   The test intercepts analytics/error telemetry and never submits a report.
   It does make a fixed Warsaw nearby read request and expects the imported
   snapshot to contain results.

## Release checks

- Confirm the staging URL, revision, migration list, import result and smoke
  output are attached to the release record.
- Confirm CSP, permissions policy and `nosniff` headers through the smoke test.
- Confirm Vercel WAF/edge-rule events show the four POST protections enabled.
- Inspect the configured error/analytics sink, if enabled, for release-time
  failures only. Never include raw latitude/longitude, request bodies or
  secrets in dashboards/logs.
- Exercise the list/detail/navigation path and a denied-location/manual-map
  recovery once on a mobile viewport.
- Confirm the map provider loads after activation and that list/detail remain
  usable if it fails.

## Failure and rollback

- **Before migration:** cancel the deployment; no database rollback is needed.
- **Migration failure:** stop, retain the migration log, and create a reviewed
  forward-fix migration. Do not run destructive down migrations against a
  shared or production-like database.
- **Bad application deployment:** restore the previously healthy immutable
  Vercel deployment, keep the database at its forward-compatible schema, and
  verify the smoke test again.
- **Bad staging data import:** reset only the disposable staging database,
  rerun migrations and import the reviewed snapshot. Do not repair rows by
  hand.
- **Rate-limit, TLS, least-privilege, observability or source-revision evidence
  missing:** staging is not approved. Resolve the missing control and repeat
  the affected checks.

## Current staging evidence

On 2026-09-14, the release candidate was deployed to the separately protected
`gdziekibel-staging` Vercel project and attached to an isolated free Neon
database in Frankfurt. PostGIS 3.6.4 was confirmed; the committed snapshot
created 562 toilets and 562 source records with zero rejects, then replayed as
562 updates with zero rejects. The application runs with a separate
`gdziekibel_app` role that is granted only the required reads and inserts.

One Vercel firewall rule is live for the four public API routes, enforcing 120
requests per 60 seconds per IP. Vercel's protected automation request path
returned a successful homepage response with the expected security headers and
a real fixed-Warsaw nearby query returned 50 ranked results.

The protected deployment intentionally prevents the ordinary Playwright browser
suite from running until a dedicated automation bypass secret is configured.
The app is now captured in local Git commit
`f46fbef0a563b84e9df72894be7c8e623a7265af` and deployed as Vercel deployment
`dpl_7Zx5oBpPT1BEJAZf4SRsvy4pM9Hf`. The browser-control package required to
create the bypass secret was unavailable in this workspace, so that setting
remains a deliberate staging follow-up. This is not evidence of production
approval.

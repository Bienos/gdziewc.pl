# TASK-033 — Production release

**Status:** In progress  
**Milestone:** 5 — Release hardening

## Goal

Deploy the approved GdzieKibel.pl release to a dedicated public production
environment, backed by a separate production PostGIS database, and verify the
critical user journey without exposing secrets or precise user location.

## Acceptance criteria

- [ ] A dedicated public production Vercel project and HTTPS URL are recorded.
- [ ] A separate production Neon/PostGIS database has migrations `000001`
      through `000004` applied and contains the verified Warsaw snapshot.
- [ ] The public runtime uses a restricted database role with only the read and
      insert privileges required by the application.
- [ ] Durable edge rate limiting protects all public POST API routes.
- [ ] The production deployment is traceable to an immutable Git revision.
- [ ] Production homepage and nearby-toilet API checks pass over HTTPS.
- [ ] A critical browser journey is verified publicly or any access limitation
      is documented truthfully.
- [ ] Rollback target and any remaining operational follow-ups are recorded.

## In scope

- Production Vercel and Neon provisioning/configuration.
- Versioned migration and verified snapshot import.
- Least-privilege runtime credentials and public API edge controls.
- Production deployment, targeted verification and factual release evidence.

## Out of scope

- New product features or visual changes.
- Scheduled OSM refresh automation, external telemetry provider selection, or
  a map-provider SLA change.
- Changes to the source data model or ingestion rules.

## References

- `ARCHITECTURE.md` sections 19–22
- `docs/adr/0001-first-toilet-data-source.md`
- `docs/adr/0002-map-renderer-and-default-tile-provider.md`
- `docs/STAGING_RELEASE.md`
- `tasks/032-staging-release-verification.md`

## Likely relevant implementation

- `db/migrations/`
- `data/osm/warsaw-toilets-2026-09-13.json.gz`
- `scripts/check-postgis.ts`
- `scripts/ingest-osm-warsaw.ts`
- `scripts/provision-staging-app-role.ts`
- `tests/staging/staging-smoke.spec.ts`

## Constraints

- Never put credentials in source control or command output.
- Use a direct non-pooled database connection for migrations and imports; use a
  pooled restricted role for the public runtime where available.
- Keep the production database separate from staging.
- Do not log, persist or send precise user location to analytics.
- Preserve the published staging deployment as a rollback/reference target.

## Verification

- Run the relevant local quality checks before deployment.
- Confirm PostGIS, migration state and import/replay counts.
- Confirm production HTTPS/security headers and the nearby API against fixed
  Warsaw coordinates.
- Exercise the public browser critical journey where hosting access permits.

## Definition of done

TASK-033 is complete when the production deployment is live, traceable and
verified against the above criteria, with remaining operational limitations
recorded in `PROGRESS.md`.

# TASK-032 — Staging release verification

**Status:** Complete (live staging infrastructure and endpoint verification complete; protected-browser and source-control evidence remain recorded limitations)  
**Priority:** P0  
**Depends on:** TASK-031

## Goal

Make the application ready for a safe, repeatable staging release and verify the
release journey wherever hosting access is available.

## Scope

- Add a non-destructive staging smoke-test entry point that targets a supplied
  HTTPS staging URL.
- Document environment setup, database migration, import, smoke verification,
  observability, and rollback/forward-fix procedures.
- With the user's explicit follow-up authority, create the isolated Vercel/Neon
  staging resources without exposing secrets.
- Record clearly which release evidence is local and which requires a deployed
  staging environment.

## Acceptance criteria

- [x] `npm run test:staging` refuses unsafe or missing staging URLs and can run
      browser smoke tests against an HTTPS deployment.
- [x] Smoke tests cover the public shell/security baseline and the non-mutating
      map/nearby-results journey.
- [x] The release runbook documents required environment variables, TLS and
      least-privilege database expectations, migration/import ordering,
      observability checks, and rollback/forward-fix actions.
- [x] The authorised isolated hosting project and managed database are created,
      linked, and documented without exposing secrets.
- [x] The staging verification result records any remaining external blockers
      without claiming unobserved deployment evidence.

## Out of scope

- Buying a domain or deploying to the user-facing production project.
- Enabling scheduled OSM refreshes or a production analytics/error-tracking
  provider.

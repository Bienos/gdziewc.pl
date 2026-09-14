# TASK-028 — Milestone integration verification

Status: Complete

## Goal

Run the complete MVP journey against the closest available real stack and fix integration defects only.

## Acceptance criteria

- All migrations apply in order to a clean PostgreSQL/PostGIS database.
- The committed OSM Warsaw snapshot ingests idempotently with preserved lineage.
- A production-mode app queries real nearby data and completes map/list/filter/detail/navigation/report flows.
- Analytics and scrubbed error records write only their allowed fields.
- Evidence distinguishes local full-stack verification from unavailable staging proof.

## Constraints

- Fix only integration defects; do not expand features.
- Never send precise user coordinates to third parties or alter canonical data from reports.

## Definition of done

TASK-028 is complete when the full core journey passes on the available integrated stack and any staging-only evidence gap is explicit.

## Verification evidence

- All four migrations applied in order to a newly created PostgreSQL 16/PostGIS 3.5 database.
- The committed 562-record OSM snapshot created 562 canonical/source rows on its first import and updated the same 562 rows with zero creates or rejects on replay.
- The production-mode full-stack journey used that database and completed location, real nearby query, preview, list, detail, navigation-link and report submission behavior.
- The clean verification database finished with 562 toilets, 562 sources, one journey report, five allowlisted analytics events and zero runtime-error events.
- The existing integration report fixture now uses transaction rollback, so a failed assertion cannot leave test data behind.
- Staging deployment evidence remains unavailable because production/staging credentials and hosting are not configured; this is deferred to TASK-031.

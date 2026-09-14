# TASK-035 — Map-area search and mobile landing refinement

**Status:** Complete (quality checks and production build passed)

## Goal

Let people browse nearby toilets around the visible map area, refresh results
after moving the map, and make the first screen less cramped on a phone.

## Acceptance criteria

- [x] All loaded nearby toilets are visible as map points by default.
- [x] Moving the map reveals a clear `SZUKAJ W TYM OBSZARZE` action.
- [x] Using that action searches around the visible map centre, within the
      existing bounded Warsaw request contract.
- [x] The mobile landing has comfortable scrolling and no clipped controls.
- [x] The footer copy reads `TY W POTRZEBIE. MY SZUKAMY.`
- [x] Existing location privacy, list, filters and navigation behaviour pass
      regression coverage.

## Out of scope

- Photo ingestion, scraping, user uploads or third-party image licensing.
- New data sources or unbounded map queries.

## Verification

- Targeted browser coverage for moving the map and searching its centre.
- Lint, typecheck, browser checks and production build.

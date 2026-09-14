# TASK-018 — Outside-Warsaw behaviour

Status: Complete (2026-09-14)

## Goal

Give people outside the supported Warsaw service area a clear response instead of a misleading empty search.

## Acceptance criteria

- A conservative, documented Warsaw service boundary is checked only after the user explicitly shares location.
- Outside-area users receive an explicit supported-area message and a manual Warsaw-map path; no nearby request is made for that location.
- Border/uncertain locations remain eligible for the normal nearby query rather than being falsely rejected.
- Location remains only in component memory and does not enter DOM, URL, storage, logs or external requests.
- Retry works and a 320px layout remains usable.

## Constraints

- This is a product-support boundary, not a legal city-polygon claim or geofence persistence feature.
- Do not add reverse geocoding, external maps/tiles, location history, routing or analytics.
- Use a generous bounding region around Warsaw; favor query eligibility over false outside-area rejection.

## Definition of done

TASK-018 is complete when clearly outside locations are honestly handled before querying, while potential Warsaw-edge locations continue through the normal nearby flow.

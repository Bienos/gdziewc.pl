# TASK-017 — No-results and radius expansion

Status: Complete (2026-09-14)

## Goal

Make an empty nearby search useful by clearly showing the searched distance and allowing a deliberate wider search.

## Acceptance criteria

- Initial nearby searches remain at the existing 2 km default radius.
- An empty 2 km response offers a clear 5 km expansion; an empty 5 km response offers a clear 10 km expansion.
- The UI states the current searched radius and distinguishes no nearby results from a service failure.
- Expansion uses the same in-memory browser position, POST request and validated nearby API contract without persistence, URL parameters or logging.
- New searches/reset location return to the initial radius and clear stale results/selection/filters.
- The expanded search and its empty/error recovery are keyboard-accessible and work at 320px width.

## Constraints

- Do not expand automatically or search beyond the nearby API's existing 10 km safety bound.
- Do not add a map radius drawing, location history, filters beyond the loaded result set, routing or outside-Warsaw behavior.
- Preserve no-store response behavior and do not surface precise user coordinates.

## Definition of done

TASK-017 is complete when an empty search gives users a truthful, deliberate 2 km → 5 km → 10 km recovery path with tested privacy and state handling.

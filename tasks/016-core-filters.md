# TASK-016 — Core filters

Status: Complete (2026-09-14)

## Goal

Let people narrow the loaded nearby results by the most useful source-supported conditions without mistaking unknown data for a match.

## Acceptance criteria

- Open now, free, wheelchair, baby-changing and 24h controls can be combined.
- A positive filter matches only explicit supporting data; unknown values never pass it.
- Filtered map and list retain the API's validated ranking/order and use the same canonical selection behavior.
- The UI shows the current matching count and an honest no-matches state with a reset action.
- Filter controls are keyboard-accessible, touch-friendly and usable at 320px width.
- Changing filters does not issue another nearby request or retain a selected toilet that no longer matches.

## Constraints

- Filter only the current nearby result set; server-side filtering and new source parsing are out of scope.
- `OTWARTE TERAZ` requires opening status `open`; `24H` requires explicit `open24h=true`.
- `DLA WÓZKA` accepts only `accessible`, not `limited`; `PRZEWIJAK` accepts only `available`.
- Do not add price ranges, custom preferences, persistence, analytics or reports.

## Definition of done

TASK-016 is complete when the five filters truthfully narrow both result views with correct unknown semantics and clear recovery from no matches.

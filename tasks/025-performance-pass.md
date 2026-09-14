# TASK-025 — Performance pass

Status: Complete (2026-09-14)

## Goal

Measure and improve the mobile core journey against explicit, reproducible budgets.

## Acceptance criteria

- A production-mode mobile audit measures initial load and the interactive core flow.
- Initial JavaScript, page transfer, layout stability and key render timings have documented budgets and evidence.
- Avoidable blocking work, oversized assets and unnecessary client code found by measurement are reduced.
- The core location/map/list/detail journey remains functionally intact.

## Budgets

- Initial route JavaScript ≤ 150 kB from the production build report.
- No externally fetched map tiles, fonts or hero imagery on initial load.
- No horizontal overflow at 320px and no visible layout shift introduced by result surfaces.
- Production build and browser journey remain green.

## Constraints

- Preserve the approved visual direction and OSM data behavior.
- Do not replace measurement with subjective claims or add a monitoring vendor.

## Definition of done

TASK-025 is complete when production evidence meets the stated budgets or any remaining exception is measured and documented.

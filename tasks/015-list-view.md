# TASK-015 — List view

Status: Complete (2026-09-14)

## Goal

Let people browse and choose the same nearby toilet results without relying on map-marker interaction.

## Acceptance criteria

- A clear MAPA/LISTA switch is available after a successful nearby search.
- The list contains the same ordered result set returned by the nearby API, including the recommended result.
- Each result exposes its name, distance, approximate walking time, opening status and qualified price state.
- Selecting a list result opens the existing canonical detail sheet; map and list selection stay synchronized.
- The list is keyboard-accessible, has usable touch targets, and works at 320px width.
- Loading, empty and service-error states remain honest and do not display stale results.

## Constraints

- Reuse the validated nearby response and its API order; do not create a separate list query or client-side ranking.
- Do not add filters until TASK-016.
- Keep precise user coordinates in component memory only and out of the DOM, URL and storage.
- Preserve the decorative local map/no external tile constraint.

## Definition of done

TASK-015 is complete when every loaded nearby result can be browsed and selected through a responsive accessible list as well as the map.

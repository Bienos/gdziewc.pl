# TASK-012 — External walking navigation

Status: Complete (2026-09-14)

## Goal

Give the selected toilet detail sheet one clear, tested walking-navigation action that opens a safe external destination without putting user location in a URL.

## Acceptance criteria

- The selected detail sheet exposes exactly one primary Prowadź mnie action.
- The action uses a destination-only Google Maps walking URL generated from canonical toilet coordinates.
- URL construction validates finite world coordinates and encodes the destination safely.
- The link requests walking mode and opens in a separate browsing context without giving the destination access to the current page.
- No user position is placed in the URL, DOM, local/session storage, analytics or logs.
- The action is unavailable when canonical destination coordinates are invalid; no malformed external URL is rendered.
- Browser tests verify href, target/rel safety, walking mode, destination-only privacy and selected-toilet binding.
- No routing service, current-position sharing, embedded maps, navigation fallback menu or new destination data is added.

## In scope

- pure external walking URL helper;
- primary action in the selected detail sheet;
- unit/browser tests and documentation.

## Out of scope

- turn-by-turn route/ETA service;
- passing the current user position to an external provider;
- Apple Maps/device-specific branching;
- share links, analytics, route logging, reports or filters.

## Constraints

- Google Maps web fallback is the only provider for this milestone.
- Use https://www.google.com/maps/dir/?api=1 and travelmode=walking.
- Destination must be derived from selected canonical result lat/lng only.
- Use target=_blank plus rel=noopener noreferrer.
- No synthetic route/arrival claims in the UI.

## Verification

- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run test:e2e with mocked result and inspected link URL
- inspect final scoped changes

## Definition of done

TASK-012 is complete when a user can launch safe walking navigation from a selected toilet detail sheet using only canonical destination coordinates, tests pass and the first core journey works end to end.

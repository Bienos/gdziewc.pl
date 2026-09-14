# TASK-026 — Accessibility pass

Status: Complete (2026-09-14)

## Goal

Audit and improve the complete map/list/detail/report journey for keyboard, screen-reader, contrast, reduced-motion and touch use.

## Acceptance criteria

- Core actions and state changes have meaningful accessible names, roles and announcements.
- Keyboard users can request location, change views/filters, select a result, use navigation/report controls and close details with predictable focus.
- Focus indicators, colour contrast and 44×44px primary touch targets meet the defined baseline.
- The layout has no 320px horizontal overflow and respects reduced motion.
- Automated semantic checks and focused browser tests cover the critical journey.

## Constraints

- Preserve the approved visual direction and OSM behavior.
- Do not rely on colour alone or require map-marker interaction.

## Definition of done

TASK-026 is complete when the critical flow is usable through keyboard and assistive semantics with verified visual/touch baselines.

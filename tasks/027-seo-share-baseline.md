# TASK-027 — SEO/share baseline

Status: Complete (2026-09-14)

## Goal

Give the Warsaw landing page correct crawler, canonical and social-sharing metadata while preserving the interactive private-location flow.

## Acceptance criteria

- Title, description, canonical URL, Open Graph and Twitter metadata accurately describe the Warsaw service.
- Robots and sitemap endpoints expose only safe public landing content.
- A branded social image is generated entirely from local code/assets without external fetching.
- Search-visible copy explains the service and OSM attribution without exposing user location.
- Metadata, routes, assets and production build are verified.

## Constraints

- Do not create individual toilet URLs, district pages or unsupported claims.
- Do not place coordinates, request state or private data in indexable URLs.

## Definition of done

TASK-027 is complete when the public Warsaw landing page has a verified canonical/share/crawler baseline.

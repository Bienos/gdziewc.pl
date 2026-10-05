# ADR-0003 — Vercel Web Analytics for page views

Status: Accepted (2026-10-05)

## Context

The owner enabled Web Analytics on the Vercel project `gdziekibel-live`, which serves `gdziewc.pl`, and asked for its `<Analytics />` component. Vercel can't install it automatically because the project's deployments come from the CLI, not from Git.

The anonymous first-party events behind `POST /api/analytics` (TASK-023) stay as they are. `PROGRESS.md` lists the final analytics provider as unresolved; this decides only page views.

## Decision

1. `@vercel/analytics` 2.0.1, pinned, is rendered once from `app/layout.tsx` through `components/analytics/page-analytics.tsx`. It records visits and page views and nothing else; the first-party events are not sent to Vercel.
2. Its `beforeSend` (`lib/analytics/page-view-url.ts`) cuts every event's URL to origin and path and drops an event whose URL can't be parsed. The only page is `/`, and location travels only in `POST` bodies, so nothing sent today changes. The rule makes sure a later link with coordinates or a search in its query string or hash can't send them to a third party (`AGENTS.md`: no raw latitude/longitude to analytics).
3. The script loads from the same-origin `/_vercel/insights/script.js`, set explicitly. On Vercel that is the package's own default. Under `next dev` the package would otherwise load a debug script from `va.vercel-scripts.com`, which the CSP blocks and the e2e suite's no-external-request checks reject. The existing CSP (`script-src 'self'`, `connect-src 'self'`) already allows the script and its same-origin event requests, so it is unchanged.

## Consequences

- Page views reach Vercel only from a Vercel deployment. Locally, `/_vercel/insights/script.js` returns 404 and nothing is sent.
- What Vercel derives from the request itself (such as country or browser) is Vercel's processing. This code doesn't widen it and can't narrow it.

## Not decided here

Whether the first-party events should also go to Vercel as custom events, and whether the site needs a privacy notice that names Vercel Web Analytics.

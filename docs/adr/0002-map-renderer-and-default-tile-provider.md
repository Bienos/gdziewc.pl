# ADR-0002 — MapLibre renderer and default tile provider

Status: Accepted for MVP implementation (2026-09-14)

## Context

`PRODUCT.md` requires a real Warsaw map, geographically correct toilet markers and a usable manual-map path when location is unavailable. The release review found that the earlier decorative SVG and clamped marker projection could not satisfy those requirements.

The architecture already selected MapLibre GL JS and forbids production use of the public OpenStreetMap tile servers. A provider must support commercial use, required attribution and privacy-conscious activation without forcing an account into local development.

## Decision

1. Use MapLibre GL JS 6.9 as the browser renderer.
2. Use OpenFreeMap's Liberty style (`https://tiles.openfreemap.org/styles/liberty`) as the default MVP style.
3. Allow an HTTPS MapLibre style override through `NEXT_PUBLIC_MAP_STYLE_URL`; explicitly reject public `tile.openstreetmap.org` hosts.
4. Load MapLibre and contact the style/tile provider only after the user shares location or deliberately activates manual browsing.
5. Serve MapLibre's worker and shared module from this application origin so the production CSP does not need `blob:` workers.
6. Keep the existing list as the accessible, provider-independent result path. A provider/style failure must not block list, details or external walking navigation.
7. Keep the original decorative artwork as the pre-activation and provider-failure background.

## Provider terms and privacy

OpenFreeMap's [official service page](https://openfreemap.org/) states that its public instance allows commercial use, has no map-view/request limits, API keys or cookies, and adds attribution automatically when used with MapLibre. Its [terms](https://openfreemap.org/tos/) provide the service as-is without an SLA and allow discontinuation. Its [privacy policy](https://openfreemap.org/privacy/) says normal logs omit IP addresses, but Cloudflare may process requests and temporary IP logging may be enabled for security incidents.

Consequently:

- the browser contacts OpenFreeMap only after deliberate activation;
- map requests reveal the requested coarse tile area and normal network metadata to OpenFreeMap/its CDN, but the application never appends the user's raw latitude/longitude to provider URLs;
- staging must exercise provider failure and retain the list journey;
- a paid/domain-restricted provider or self-hosted OpenFreeMap remains a supported configuration if an SLA becomes necessary.

## Consequences

- Real streets, labels, pan and zoom replace decorative result placement in activated journeys.
- The initial call-to-action remains free of map JavaScript and external map traffic.
- OpenFreeMap's lack of SLA is an explicit operational risk, not an unstated production guarantee.
- A future provider switch changes configuration and CSP allowlists but does not replace the MapLibre component or domain model.

import type { BeforeSendEvent } from "@vercel/analytics/next";

/**
 * The address a Vercel Web Analytics event may carry (ADR-0003): origin and
 * path only. The query string and hash are dropped so nothing a later link
 * puts there, such as coordinates, leaves the browser. Returns `null` for an
 * address that cannot be parsed.
 */
export function pageViewUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return null;
  }
}

/** `beforeSend` for `<Analytics />`: sends the stripped address, or drops an unparseable event. */
export function redactPageView(event: BeforeSendEvent): BeforeSendEvent | null {
  const url = pageViewUrl(event.url);
  return url === null ? null : { ...event, url };
}

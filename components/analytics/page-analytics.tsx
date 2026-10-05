"use client";

import { Analytics } from "@vercel/analytics/next";
import { redactPageView } from "@/lib/analytics/page-view-url";

/**
 * Same-origin path Vercel serves the analytics script from. Set explicitly so
 * `next dev` loads it from here too, instead of the package's development
 * default on va.vercel-scripts.com: the CSP and the e2e suite allow no other
 * script origin. Outside Vercel the path 404s and nothing is sent.
 */
const SCRIPT_SRC = "/_vercel/insights/script.js";

/** Vercel Web Analytics page views (ADR-0003), next to the first-party events. */
export function PageAnalytics() {
  return <Analytics beforeSend={redactPageView} scriptSrc={SCRIPT_SRC} />;
}

import { z } from "zod";

export const ANALYTICS_EVENTS = ["location_requested", "nearby_loaded", "view_changed", "filter_toggled", "detail_opened", "navigation_opened", "report_submitted"] as const;
export const analyticsEventSchema = z.object({
  name: z.enum(ANALYTICS_EVENTS),
  result: z.enum(["success", "empty", "error"]).optional(),
  view: z.enum(["map", "list"]).optional(),
  filter: z.enum(["openNow", "free", "wheelchair", "babyChanging", "open24h"]).optional(),
}).strict();
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

export function trackAnalyticsEvent(event: AnalyticsEvent): void {
  void fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(event), keepalive: true }).catch(() => {
    void fetch("/api/errors", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ code: "analytics_failed", surface: "analytics" }), keepalive: true }).catch(() => undefined);
  });
}

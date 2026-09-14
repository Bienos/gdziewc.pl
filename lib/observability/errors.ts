import { z } from "zod";

export const errorRecordSchema = z.object({
  code: z.enum(["nearby_failed", "report_failed", "analytics_failed"]),
  surface: z.enum(["location", "report", "analytics"]),
}).strict();
export type ErrorRecord = z.infer<typeof errorRecordSchema>;

export function scrubErrorRecord(value: unknown): ErrorRecord | null {
  const parsed = errorRecordSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

export function trackSafeError(record: ErrorRecord): void {
  void fetch("/api/errors", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(record), keepalive: true }).catch(() => undefined);
}

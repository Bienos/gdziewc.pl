import { z } from "zod";

export const REPORT_ISSUE_TYPES = ["closed", "missing", "hours", "price", "access", "other"] as const;

export const toiletReportRequestSchema = z.object({
  toiletId: z.string().uuid(),
  issueType: z.enum(REPORT_ISSUE_TYPES),
  note: z.string().trim().min(1).max(500).optional(),
}).strict();

export type ToiletReportRequest = z.infer<typeof toiletReportRequestSchema>;

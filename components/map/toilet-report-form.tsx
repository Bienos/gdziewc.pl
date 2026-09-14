"use client";

import { useState } from "react";
import { trackAnalyticsEvent } from "@/lib/analytics/events";
import { trackSafeError } from "@/lib/observability/errors";

interface ToiletReportFormProps { toiletId: string }

export function ToiletReportForm({ toiletId }: ToiletReportFormProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("sending");
    try {
      const response = await fetch("/api/toilet-reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ toiletId, issueType: formData.get("issueType"), note: formData.get("note") || undefined }),
      });
      if (!response.ok) throw new Error("Report failed");
      setStatus("sent");
      trackAnalyticsEvent({ name: "report_submitted", result: "success" });
    } catch {
      setStatus("error");
      trackSafeError({ code: "report_failed", surface: "report" });
    }
  }

  if (status === "sent") return <p className="toilet-report-form__sent" role="status">DZIĘKI — SPRAWDZIMY TO.</p>;
  if (!open) return <button className="toilet-report-form__open" type="button" onClick={() => setOpen(true)}>ZGŁOŚ BŁĘDNE DANE</button>;
  return (
    <form className="toilet-report-form" action={submit}>
      <label>CO SIĘ NIE ZGADZA?
        <select name="issueType" required defaultValue=""><option value="" disabled>WYBIERZ</option><option value="closed">NIE DZIAŁA</option><option value="missing">NIE MA TOALETY</option><option value="hours">GODZINY</option><option value="price">CENA</option><option value="access">DOSTĘPNOŚĆ</option><option value="other">INNE</option></select>
      </label>
      <label>KRÓTKA UWAGA (OPCJONALNIE)<textarea name="note" maxLength={500} rows={2} /></label>
      {status === "error" ? <p role="status">NIE UDAŁO SIĘ WYSŁAĆ. SPRÓBUJ PONOWNIE.</p> : null}
      <button type="submit" disabled={status === "sending"}>{status === "sending" ? "WYSYŁAM…" : "WYŚLIJ ZGŁOSZENIE"}</button>
    </form>
  );
}

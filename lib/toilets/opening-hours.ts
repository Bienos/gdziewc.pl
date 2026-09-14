export const OPENING_STATUS_VALUES = ["open", "closed", "unknown"] as const;
export type OpeningStatus = (typeof OPENING_STATUS_VALUES)[number];

const DAY_INDEX: Record<string, number> = {
  Mo: 0,
  Tu: 1,
  We: 2,
  Th: 3,
  Fr: 4,
  Sa: 5,
  Su: 6,
};

const WEEKDAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Warsaw",
  weekday: "short",
});
const TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Warsaw",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

interface TimeRange {
  start: number;
  end: number;
}

interface OpeningRule {
  days: number[];
  times: TimeRange[];
}

function localTime(now: Date): { day: number; minute: number } | null {
  const weekday = WEEKDAY_FORMATTER.format(now).slice(0, 2);
  const day = DAY_INDEX[weekday];
  const parts = Object.fromEntries(
    TIME_FORMATTER.formatToParts(now)
      .filter((part) => part.type === "hour" || part.type === "minute")
      .map((part) => [part.type, part.value]),
  );
  const hour = Number(parts.hour);
  const minute = Number(parts.minute);
  if (day === undefined || !Number.isInteger(hour) || !Number.isInteger(minute)) return null;
  return { day, minute: hour * 60 + minute };
}

function parseMinute(value: string, allowTwentyFour = false): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (minute > 59 || hour > 24 || (hour === 24 && (!allowTwentyFour || minute !== 0))) return null;
  return hour * 60 + minute;
}

function parseDays(value: string | undefined): number[] | null {
  if (!value) return [0, 1, 2, 3, 4, 5, 6];
  const days: number[] = [];
  for (const part of value.split(",")) {
    const [from, to] = part.split("-");
    const start = DAY_INDEX[from];
    const end = DAY_INDEX[to ?? from];
    if (start === undefined || end === undefined) return null;
    for (let current = start; ; current = (current + 1) % 7) {
      days.push(current);
      if (current === end) break;
    }
  }
  return [...new Set(days)];
}

function parseRule(value: string): OpeningRule | null {
  const normalized = value.trim().replace(/\s*-\s*/g, "-");
  const match = /^(?:(?<days>[A-Za-z,-]+)\s+)?(?<times>\d{1,2}:\d{2}-\d{1,2}:\d{2}(?:,\d{1,2}:\d{2}-\d{1,2}:\d{2})*)$/.exec(normalized);
  if (!match?.groups) return null;
  const days = parseDays(match.groups.days);
  if (!days) return null;
  const times = match.groups.times.split(",").map((range) => {
    const [startValue, endValue] = range.split("-");
    const start = parseMinute(startValue);
    const end = parseMinute(endValue, true);
    return start === null || end === null ? null : { start, end };
  });
  if (times.some((range) => range === null)) return null;
  return { days, times: times as TimeRange[] };
}

function isOpenAt(rule: OpeningRule, day: number, minute: number): boolean {
  return rule.times.some(({ start, end }) => {
    if (end > start) return rule.days.includes(day) && minute >= start && minute < end;
    if (end < start) {
      const previousDay = (day + 6) % 7;
      return (rule.days.includes(day) && minute >= start)
        || (rule.days.includes(previousDay) && minute < end);
    }
    return false;
  });
}

export function openingStatus(raw: string | null, now = new Date()): OpeningStatus {
  if (!raw?.trim()) return "unknown";
  if (raw.trim() === "24/7") return "open";
  const local = localTime(now);
  if (!local) return "unknown";

  const normalized = raw.replace(/,\s*(?=(?:Mo|Tu|We|Th|Fr|Sa|Su)\b)/g, ";");
  const rules = normalized.split(";").map((part) => parseRule(part));
  if (rules.length === 0 || rules.some((rule) => rule === null)) return "unknown";
  return (rules as OpeningRule[]).some((rule) => isOpenAt(rule, local.day, local.minute))
    ? "open"
    : "closed";
}

export function openingStatusLabel(status: OpeningStatus): string {
  if (status === "open") return "OTWARTY";
  if (status === "closed") return "ZAMKNIĘTY";
  return "STATUS NIEZNANY";
}

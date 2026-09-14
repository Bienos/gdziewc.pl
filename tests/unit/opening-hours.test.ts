import { describe, expect, it } from "vitest";
import { openingStatus, openingStatusLabel } from "../../lib/toilets/opening-hours";

describe("Warsaw opening-hours evaluator", () => {
  const mondayMorning = new Date("2026-01-05T08:00:00Z"); // 09:00 Europe/Warsaw

  it("evaluates always-open and plain daily ranges", () => {
    expect(openingStatus("24/7", mondayMorning)).toBe("open");
    expect(openingStatus("06:00-22:00", mondayMorning)).toBe("open");
    expect(openingStatus("06:00-08:00", mondayMorning)).toBe("closed");
  });

  it("evaluates weekday/weekend rules in Europe/Warsaw", () => {
    expect(openingStatus("Mo-Fr 08:00-16:00", mondayMorning)).toBe("open");
    expect(openingStatus("Mo-Fr 08:00-16:00", new Date("2026-01-10T08:00:00Z"))).toBe("closed");
    expect(
      openingStatus("Mo-Fr 06:00-22:00; Sa-Su 08:00-22:00", new Date("2026-01-10T09:00:00Z")),
    ).toBe("open");
  });

  it("supports split and overnight source-supported ranges", () => {
    expect(openingStatus("06:00-13:30,14:00-21:30", new Date("2026-01-05T12:45:00Z"))).toBe("closed");
    expect(openingStatus("Mo 22:00-02:00", new Date("2026-01-05T22:30:00Z"))).toBe("open");
    expect(openingStatus("Mo 22:00-02:00", new Date("2026-01-06T00:30:00Z"))).toBe("open");
    expect(openingStatus("Mo 22:00-02:00", new Date("2026-01-06T02:30:00Z"))).toBe("closed");
  });

  it("uses Warsaw timezone across DST and never guesses unsupported values", () => {
    expect(openingStatus("Mo-Fr 08:00-16:00", new Date("2026-03-30T08:00:00Z"))).toBe("open");
    expect(openingStatus(null, mondayMorning)).toBe("unknown");
    expect(openingStatus("Mo-Su,PH 12:00-11:00", mondayMorning)).toBe("unknown");
    expect(openingStatus("Mar-Oct: 9:00-21:00", mondayMorning)).toBe("unknown");
    expect(openingStatusLabel("unknown")).toBe("STATUS NIEZNANY");
  });
});

import { describe, expect, it } from "vitest";
import {
  ACCESS_PENALTY,
  CONFIDENCE_ADJUSTMENT,
  rankToilets,
  recommendationScore,
} from "../../lib/toilets/ranking";

describe("toilet recommendation ranking", () => {
  it("locks the transparent scoring constants", () => {
    expect(ACCESS_PENALTY).toEqual({ public: 0, unknown: 80, restricted: 250 });
    expect(CONFIDENCE_ADJUSTMENT).toEqual({ high: -80, medium: -40, low: 0 });
  });

  it("lets a slightly farther high-confidence public toilet beat an uncertain one", () => {
    const ranked = rankToilets([
      { id: "b", distanceMeters: 100, accessState: "unknown", confidenceLevel: "low" },
      { id: "a", distanceMeters: 190, accessState: "public", confidenceLevel: "high" },
    ]);
    expect(ranked.map((toilet) => toilet.id)).toEqual(["a", "b"]);
    expect(ranked[0]).toMatchObject({
      recommendationRank: 1,
      recommendationScore: 110,
      isRecommended: true,
    });
  });

  it("keeps distance dominant beyond the bounded trust/access adjustments", () => {
    const ranked = rankToilets([
      { id: "near", distanceMeters: 50, accessState: "restricted", confidenceLevel: "low" },
      { id: "far", distanceMeters: 381, accessState: "public", confidenceLevel: "high" },
    ]);
    expect(ranked.map((toilet) => toilet.id)).toEqual(["near", "far"]);
  });

  it("uses distance, confidence and ID as stable tie-breaks without mutating input", () => {
    const input = [
      { id: "z", distanceMeters: 100, accessState: "public" as const, confidenceLevel: "low" as const },
      { id: "b", distanceMeters: 180, accessState: "public" as const, confidenceLevel: "high" as const },
      { id: "a", distanceMeters: 180, accessState: "public" as const, confidenceLevel: "high" as const },
    ];
    const ranked = rankToilets(input);
    expect(ranked.map((toilet) => toilet.id)).toEqual(["z", "a", "b"]);
    expect(input.map((toilet) => toilet.id)).toEqual(["z", "b", "a"]);
    expect(ranked.filter((toilet) => toilet.isRecommended)).toHaveLength(1);
  });

  it("does not inspect hours, price or facility unknowns", () => {
    const base = {
      id: "same",
      distanceMeters: 200,
      accessState: "unknown" as const,
      confidenceLevel: "low" as const,
    };
    expect(recommendationScore(base)).toBe(280);
  });
});

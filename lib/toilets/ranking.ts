export const ACCESS_PENALTY = {
  public: 0,
  unknown: 80,
  restricted: 250,
} as const;

export const CONFIDENCE_ADJUSTMENT = {
  high: -80,
  medium: -40,
  low: 0,
} as const;

export interface RankableToilet {
  id: string;
  distanceMeters: number;
  accessState: keyof typeof ACCESS_PENALTY;
  confidenceLevel: keyof typeof CONFIDENCE_ADJUSTMENT;
}

export interface RecommendationMetadata {
  recommendationRank: number;
  recommendationScore: number;
  isRecommended: boolean;
}

function confidenceTieBreak(value: RankableToilet["confidenceLevel"]): number {
  return { high: 0, medium: 1, low: 2 }[value];
}

export function recommendationScore(toilet: RankableToilet): number {
  return toilet.distanceMeters
    + ACCESS_PENALTY[toilet.accessState]
    + CONFIDENCE_ADJUSTMENT[toilet.confidenceLevel];
}

export function rankToilets<T extends RankableToilet>(
  toilets: readonly T[],
): Array<T & RecommendationMetadata> {
  return [...toilets]
    .sort((a, b) =>
      recommendationScore(a) - recommendationScore(b)
      || a.distanceMeters - b.distanceMeters
      || confidenceTieBreak(a.confidenceLevel) - confidenceTieBreak(b.confidenceLevel)
      || a.id.localeCompare(b.id),
    )
    .map((toilet, index) => ({
      ...toilet,
      recommendationRank: index + 1,
      recommendationScore: recommendationScore(toilet),
      isRecommended: index === 0,
    }));
}

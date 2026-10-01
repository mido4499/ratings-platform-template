export const MIN_SCORE = 1;
export const MAX_SCORE = 5;

/** True if the score is a whole number of stars between MIN_SCORE and MAX_SCORE. */
export function isValidScore(score: unknown): score is number {
    return Number.isInteger(score) && (score as number) >= MIN_SCORE && (score as number) <= MAX_SCORE;
}

/**
 * Average score of a list of reviews, rounded to the nearest half star
 * (e.g. 3.74 -> 3.5). Returns 0 when there are no reviews.
 */
export function averageScore(reviews: { score: number }[]): number {
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + review.score, 0);
    return Math.round((total / reviews.length) * 2) / 2;
}

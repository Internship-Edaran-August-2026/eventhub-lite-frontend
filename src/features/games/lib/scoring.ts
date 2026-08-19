/**
 * Score = (1 - (timeTaken / totalTime) * 0.5) * 1000
 * Full marks for an instant answer, decaying to half marks at the wire.
 */
export function calculateQuizScore(timeTakenMs: number, totalTimeSeconds: number): number {
  const totalTimeMs = totalTimeSeconds * 1000;
  const ratio = Math.min(Math.max(timeTakenMs / totalTimeMs, 0), 1);
  return Math.round((1 - ratio * 0.5) * 1000);
}

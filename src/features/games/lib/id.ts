/**
 * db.json ids across the app follow a `<3-letter-prefix>_<random>` scheme
 * (evt_001, prt_001, usr_001). json-server auto-ids are plain numbers, so
 * games generates its own ids client-side to keep the same convention.
 */
function randomSegment(length: number): string {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length)
    .padEnd(length, "0");
}

export function generateId(prefix: string): string {
  return `${prefix}_${randomSegment(8)}`;
}

export function generatePinCode(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

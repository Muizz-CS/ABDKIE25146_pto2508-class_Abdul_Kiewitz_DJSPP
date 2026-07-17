/**
 * Formats a duration in seconds as `m:ss`, e.g. `125` -> `"2:05"`.
 * Used for audio player timestamps.
 *
 * @param {number} seconds - Duration in seconds.
 * @returns {string} The formatted time, or `"0:00"` if `seconds` is falsy or NaN.
 */
export function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}
/**
 * Formats an ISO date string as a short date, e.g. "Nov 3, 2022".
 *
 * @param {string} isoString - An ISO 8601 date string.
 * @returns {string} The formatted date, or an empty string if `isoString` is falsy.
 */
export function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats an ISO date string as a date and time, e.g. "Nov 3, 2022, 4:15 PM".
 * Used for "date added to favourites" so both date and time are visible.
 *
 * @param {string} isoString - An ISO 8601 date string.
 * @returns {string} The formatted date and time, or an empty string if `isoString` is falsy.
 */
export function formatDateTime(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
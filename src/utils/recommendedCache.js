import { shuffle } from "./shuffle";

let cachedRecommended = null;

/**
 * Picks a random sample of shows for the "recommended" carousel and
 * caches the result at module level (outside React), so the same picks
 * persist for the whole browser session instead of reshuffling every
 * time the landing page component remounts — e.g. when the user clicks
 * into a show and then navigates back.
 *
 * @param {Array<object>} shows - Full list of show previews to sample from.
 * @param {number} count - How many shows to pick.
 * @returns {Array<object>} The (cached) list of recommended shows.
 */
export function getRecommendedShows(shows, count) {
  if (!cachedRecommended) {
    cachedRecommended = shuffle(shows).slice(0, count);
  }
  return cachedRecommended;
}
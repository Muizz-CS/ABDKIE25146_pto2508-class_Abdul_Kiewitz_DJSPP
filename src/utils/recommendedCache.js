import { shuffle } from "./shuffle";

let cachedRecommended = null;

export function getRecommendedShows(shows, count) {
  if (!cachedRecommended) {
    cachedRecommended = shuffle(shows).slice(0, count);
  }
  return cachedRecommended;
}
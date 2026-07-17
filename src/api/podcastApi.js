/** Base URL for the placeholder podcast API used throughout the app. */
export const BASE_URL = "https://podcast-api.netlify.app";

let showsCache = null;

/**
 * Fetches all show previews from the API. The result is cached in memory
 * after the first successful call, so subsequent calls in the same
 * browser session return instantly instead of re-fetching.
 *
 * @returns {Promise<Array<object>>} Array of show preview objects
 *   (id, title, description, seasons [count], image, genres [ids], updated).
 * @throws {Error} If the request fails.
 */
export async function getAllShows() {
  if (showsCache) return showsCache;
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch shows");
  const data = await res.json();
  showsCache = data;
  return data;
}

/**
 * Fetches full detail for a single show, including its seasons and each
 * season's episode list.
 *
 * @param {string|number} id - The show's id.
 * @returns {Promise<object>} The full show object.
 * @throws {Error} If the request fails.
 */
export async function getShowById(id) {
  const res = await fetch(`${BASE_URL}/id/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch show ${id}`);
  return res.json();
}

/**
 * Fetches a single genre's title, description, and the ids of shows
 * belonging to it.
 *
 * @param {string|number} id - The genre's id.
 * @returns {Promise<{ id: number, title: string, description: string, shows: string[] }>}
 * @throws {Error} If the request fails.
 */
export async function getGenreById(id) {
  const res = await fetch(`${BASE_URL}/genre/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch genre ${id}`);
  return res.json();
}
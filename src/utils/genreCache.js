import { BASE_URL } from "../api/podcastApi";

const cache = new Map();

/**
 * Fetches a genre's title by id, caching the result so repeat lookups
 * for the same id never hit the network twice.
 *
 * @param {string|number} id - The genre's id.
 * @returns {Promise<string>} The genre's title, or "Unknown" if the fetch fails.
 */
export async function getGenreTitle(id) {
  if (cache.has(id)) return cache.get(id);

  try {
    const res = await fetch(`${BASE_URL}/genre/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch genre ${id}`);
    const data = await res.json();
    cache.set(id, data.title);
    return data.title;
  } catch (err) {
    console.error(err);
    return "Unknown";
  }
}

/**
 * Resolves a list of genre ids to a `{ id: title }` map, fetching any
 * not-yet-cached ids in parallel via `getGenreTitle`.
 *
 * @param {Array<string|number>} ids - Genre ids to resolve (duplicates allowed).
 * @returns {Promise<Object<string, string>>} Map of genre id to title.
 */
export async function getGenreTitles(ids) {
  const uniqueIds = [...new Set(ids)];
  const titles = await Promise.all(uniqueIds.map(getGenreTitle));
  return Object.fromEntries(uniqueIds.map((id, i) => [id, titles[i]]));
}
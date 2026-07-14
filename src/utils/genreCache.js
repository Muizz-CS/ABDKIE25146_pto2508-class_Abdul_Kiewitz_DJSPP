import { BASE_URL } from "../api/podcastApi";

const cache = new Map();

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

export async function getGenreTitles(ids) {
  const uniqueIds = [...new Set(ids)];
  const titles = await Promise.all(uniqueIds.map(getGenreTitle));
  return Object.fromEntries(uniqueIds.map((id, i) => [id, titles[i]]));
}
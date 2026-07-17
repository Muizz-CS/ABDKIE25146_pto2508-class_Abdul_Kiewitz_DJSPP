export const BASE_URL = "https://podcast-api.netlify.app";

let showsCache = null;

export async function getAllShows() {
  if (showsCache) return showsCache;
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch shows");
  const data = await res.json();
  showsCache = data;
  return data;
}

export async function getShowById(id) {
  const res = await fetch(`${BASE_URL}/id/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch show ${id}`);
  return res.json();
}

export async function getGenreById(id) {
  const res = await fetch(`${BASE_URL}/genre/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch genre ${id}`);
  return res.json();
}
export const BASE_URL = "https://podcast-api.netlify.app";

export async function getAllShows() {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Failed to fetch shows");
  return res.json();
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
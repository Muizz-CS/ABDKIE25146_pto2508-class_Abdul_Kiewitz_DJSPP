import { useEffect, useMemo, useState } from "react";
import { getAllShows } from "../api/podcastApi";
import { getGenreTitles } from "../utils/genreCache";
import ShowCard from "../components/shows/ShowCard";

export default function LandingPage() {
  const [shows, setShows] = useState([]);
  const [genreTitles, setGenreTitles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title-asc");

  useEffect(() => {
    getAllShows()
      .then(async (data) => {
        setShows(data);
        const allGenreIds = data.flatMap((show) => show.genres);
        const titles = await getGenreTitles(allGenreIds);
        setGenreTitles(titles);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = shows.filter((show) =>
      show.title.toLowerCase().includes(search.toLowerCase())
    );

    if (genreFilter !== "all") {
      result = result.filter((show) => show.genres.includes(Number(genreFilter)));
    }

    switch (sortBy) {
      case "title-asc":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "updated-newest":
        result = [...result].sort((a, b) => new Date(b.updated) - new Date(a.updated));
        break;
      case "updated-oldest":
        result = [...result].sort((a, b) => new Date(a.updated) - new Date(b.updated));
        break;
      default:
        break;
    }

    return result;
  }, [shows, search, genreFilter, sortBy]);

  if (loading) return <p>Loading shows…</p>;
  if (error) return <p>Something went wrong: {error}</p>;

  return (
    <div className="landing-page">
      <div className="landing-controls">
        <input
          type="text"
          placeholder="Search shows…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="all">All genres</option>
          {Object.entries(genreTitles).map(([id, title]) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
          <option value="updated-newest">Recently updated</option>
          <option value="updated-oldest">Least recently updated</option>
        </select>
      </div>

      <div className="show-grid">
        {filteredAndSorted.map((show) => (
          <ShowCard key={show.id} show={show} genreTitles={genreTitles} />
        ))}
      </div>
    </div>
  );
}
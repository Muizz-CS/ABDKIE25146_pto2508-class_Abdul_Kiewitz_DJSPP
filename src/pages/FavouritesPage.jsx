import { useMemo, useState } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { formatDateTime } from "../utils/formatDate";

export default function FavouritesPage() {
  const { favourites, removeFavourite } = useFavourites();
  const { playEpisode } = useAudioPlayer();
  const [sortBy, setSortBy] = useState("title-asc");

  const groupedAndSorted = useMemo(() => {
    const groups = {};
    for (const fav of favourites) {
      if (!groups[fav.showTitle]) groups[fav.showTitle] = [];
      groups[fav.showTitle].push(fav);
    }

    function sortEpisodes(episodes) {
      const sorted = [...episodes];
      switch (sortBy) {
        case "title-asc":
          sorted.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "title-desc":
          sorted.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case "date-newest":
          sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
          break;
        case "date-oldest":
          sorted.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
          break;
        default:
          break;
      }
      return sorted;
    }

    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([showTitle, episodes]) => [showTitle, sortEpisodes(episodes)]);
  }, [favourites, sortBy]);

  if (favourites.length === 0) {
    return (
      <div className="favourites-page">
        <h1>Favourites</h1>
        <p>No favourites yet — go favourite some episodes!</p>
      </div>
    );
  }

  return (
    <div className="favourites-page">
      <div className="favourites-page__header">
        <h1>Favourites</h1>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title-asc">Title A–Z</option>
          <option value="title-desc">Title Z–A</option>
          <option value="date-newest">Newest added</option>
          <option value="date-oldest">Oldest added</option>
        </select>
      </div>

      {groupedAndSorted.map(([showTitle, episodes]) => (
        <div key={showTitle} className="favourites-group">
          <h2>{showTitle}</h2>
          <div className="episode-list">
            {episodes.map((fav) => (
              <div key={fav.id} className="episode-item">
                <div>
                  <h3>{fav.episode}. {fav.title}</h3>
                  <p className="show-detail__meta">{fav.seasonTitle}</p>
                  <p className="show-detail__meta">Added {formatDateTime(fav.addedAt)}</p>
                </div>
                <div className="episode-item__actions">
                  <button onClick={() => playEpisode(fav)} className="play-button">
                    ▶ Play
                  </button>
                  <button
                    onClick={() => removeFavourite(fav.showId, fav.seasonTitle, fav.episode)}
                    className="favourite-button favourite-button--active"
                    aria-label="Remove from favourites"
                  >
                    ♥
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
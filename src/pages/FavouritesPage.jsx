import { useMemo, useState } from "react";
import { useFavourites } from "../context/FavouritesContext";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { useListeningProgress } from "../context/ListeningProgressContext";
import { formatDateTime } from "../utils/formatDate";
import EpisodeItem from "../components/episodes/EpisodeItem";

export default function FavouritesPage() {
  const { favourites, removeFavourite } = useFavourites();
  const { currentEpisode, isPlaying, playEpisode, togglePlay } = useAudioPlayer();
  const { getProgress } = useListeningProgress();
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

  function isCurrentEpisode(fav) {
    return (
      currentEpisode &&
      currentEpisode.showId === fav.showId &&
      currentEpisode.seasonTitle === fav.seasonTitle &&
      currentEpisode.episode === fav.episode
    );
  }

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
            {episodes.map((fav) => {
              const active = isCurrentEpisode(fav);
              const saved = getProgress(fav.showId, fav.seasonTitle, fav.episode);
              const percent =
                saved && saved.duration
                  ? Math.min(100, Math.round((saved.position / saved.duration) * 100))
                  : 0;

              let playLabel = "▶ Play";
              if (active && isPlaying) playLabel = "⏸ Pause";
              else if (saved && !saved.finished && saved.position > 3) playLabel = "▶ Resume";

              return (
                <EpisodeItem
                  key={fav.id}
                  episode={fav}
                  subtitle={[fav.seasonTitle, `Added ${formatDateTime(fav.addedAt)}`]}
                  progress={saved ? { percent, finished: saved.finished } : null}
                  favourited
                  onToggleFavourite={() => removeFavourite(fav.showId, fav.seasonTitle, fav.episode)}
                  playLabel={playLabel}
                  onPlayClick={() => (active ? togglePlay() : playEpisode(fav))}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
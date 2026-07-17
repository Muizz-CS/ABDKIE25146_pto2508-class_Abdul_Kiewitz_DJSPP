import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getShowById } from "../api/podcastApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { useFavourites } from "../context/FavouritesContext";
import { useListeningProgress } from "../context/ListeningProgressContext";
import { formatDate } from "../utils/formatDate";
import SeasonTabs from "../components/shows/SeasonTabs";
import EpisodeItem from "../components/episodes/EpisodeItem";

export default function ShowDetailPage() {
  const { id } = useParams();
  return <ShowDetail key={id} id={id} />;
}

function ShowDetail({ id }) {
  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSeason, setActiveSeason] = useState(0);

  const { currentEpisode, isPlaying, playEpisode, togglePlay } = useAudioPlayer();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { getProgress } = useListeningProgress();

  useEffect(() => {
    getShowById(id)
      .then(setShow)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading show…</p>;
  if (error) return <p>Something went wrong: {error}</p>;
  if (!show) return null;

  const season = show.seasons[activeSeason];

  function buildEpisodeData(episode) {
    return {
      showId: show.id,
      showTitle: show.title,
      seasonTitle: season.title,
      ...episode,
    };
  }

  function isCurrentEpisode(episode) {
    return (
      currentEpisode &&
      currentEpisode.showId === show.id &&
      currentEpisode.seasonTitle === season.title &&
      currentEpisode.episode === episode.episode
    );
  }

  function handleEpisodeClick(episode) {
    if (isCurrentEpisode(episode)) {
      togglePlay();
    } else {
      playEpisode(buildEpisodeData(episode));
    }
  }

  return (
    <div className="show-detail">
      <Link to="/" className="back-link">← Back to shows</Link>

      <div className="show-detail__header">
        <img src={show.image} alt={show.title} className="show-detail__image" />
        <div>
          <h1>{show.title}</h1>
          <p>{show.description}</p>
          <p className="show-detail__meta">
            Last updated {formatDate(show.updated)}
          </p>
        </div>
      </div>

      <SeasonTabs seasons={show.seasons} activeIndex={activeSeason} onSelect={setActiveSeason} />

      <div className="episode-list">
        {season.episodes.map((episode) => {
          const active = isCurrentEpisode(episode);
          const favourited = isFavourite(show.id, season.title, episode.episode);
          const saved = getProgress(show.id, season.title, episode.episode);
          const percent =
            saved && saved.duration
              ? Math.min(100, Math.round((saved.position / saved.duration) * 100))
              : 0;

          let playLabel = "▶ Play";
          if (active && isPlaying) playLabel = "⏸ Pause";
          else if (saved && !saved.finished && saved.position > 3) playLabel = "▶ Resume";

          return (
            <EpisodeItem
              key={episode.episode}
              episode={episode}
              subtitle={episode.description}
              progress={saved ? { percent, finished: saved.finished } : null}
              favourited={favourited}
              onToggleFavourite={() => toggleFavourite(buildEpisodeData(episode))}
              playLabel={playLabel}
              onPlayClick={() => handleEpisodeClick(episode)}
            />
          );
        })}
      </div>
    </div>
  );
}
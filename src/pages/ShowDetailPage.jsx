import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getShowById } from "../api/podcastApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { formatDate } from "../utils/formatDate";

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
      playEpisode({
        showId: show.id,
        showTitle: show.title,
        seasonTitle: season.title,
        ...episode,
      });
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

      <div className="season-tabs">
        {show.seasons.map((s, index) => (
          <button
            key={s.season}
            className={`season-tab ${index === activeSeason ? "season-tab--active" : ""}`}
            onClick={() => setActiveSeason(index)}
          >
            {s.title}
          </button>
        ))}
      </div>

      <div className="episode-list">
        {season.episodes.map((episode) => {
          const active = isCurrentEpisode(episode);
          return (
            <div key={episode.episode} className="episode-item">
              <div>
                <h3>{episode.episode}. {episode.title}</h3>
                <p>{episode.description}</p>
              </div>
              <button onClick={() => handleEpisodeClick(episode)} className="play-button">
                {active && isPlaying ? "⏸ Pause" : "▶ Play"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
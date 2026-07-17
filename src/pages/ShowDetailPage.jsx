import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getShowById } from "../api/podcastApi";
import { useAudioPlayer } from "../context/AudioPlayerContext";
import { useFavourites } from "../context/FavouritesContext";
import { useListeningProgress } from "../context/ListeningProgressContext";
import { formatDate } from "../utils/formatDate";
import SeasonTabs from "../components/shows/SeasonTabs";
import EpisodeItem from "../components/episodes/EpisodeItem";

/**
 * Route component for `/show/:id`. Reads the id from the URL and renders
 * `ShowDetail` keyed on it, so navigating between two different shows
 * fully remounts the inner component — resetting its `loading`/`activeSeason`
 * state for free, rather than resetting it manually inside an effect.
 */
export default function ShowDetailPage() {
  const { id } = useParams();
  return <ShowDetail key={id} id={id} />;
}

/**
 * Fetches and renders a single show: header (image/title/description),
 * season tabs, and the active season's episode list with play/favourite/
 * progress controls.
 *
 * @param {object} props
 * @param {string} props.id - The show's id (from the route).
 */
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

  /**
   * Builds the episode payload shape shared by playback and favouriting,
   * tagging a raw episode object with its parent show/season info.
   *
   * @param {object} episode - Raw episode object (title, description, episode, file).
   * @returns {object} Episode data enriched with showId, showTitle, seasonTitle.
   */
  function buildEpisodeData(episode) {
    return {
      showId: show.id,
      showTitle: show.title,
      seasonTitle: season.title,
      ...episode,
    };
  }

  /**
   * @param {object} episode - Raw episode object.
   * @returns {boolean} Whether this is the episode currently loaded in the global player.
   */
  function isCurrentEpisode(episode) {
    return (
      currentEpisode &&
      currentEpisode.showId === show.id &&
      currentEpisode.seasonTitle === season.title &&
      currentEpisode.episode === episode.episode
    );
  }

  /** Plays the given episode, or toggles play/pause if it's already the loaded one. */
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
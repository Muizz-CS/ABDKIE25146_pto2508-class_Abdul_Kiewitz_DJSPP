/**
 * A single episode row: title, secondary info, an optional progress bar,
 * a favourite toggle, and a play/pause/resume button. Shared by
 * ShowDetailPage and FavouritesPage so both stay visually and
 * functionally in sync — the caller decides what subtitle/progress/label
 * to pass in, this component just renders it consistently.
 *
 * @param {object} props
 * @param {object} props.episode - Episode data with at least `episode` (number) and `title`.
 * @param {string|string[]} props.subtitle - One line of secondary text, or several (rendered as separate paragraphs).
 * @param {{ percent: number, finished: boolean }|null} props.progress - Listening progress to display, or `null` to hide the progress bar entirely.
 * @param {boolean} props.favourited - Whether this episode is currently favourited (controls heart icon fill).
 * @param {() => void} props.onToggleFavourite - Called when the heart button is clicked.
 * @param {string} props.playLabel - Text for the play button, e.g. "▶ Play", "⏸ Pause", "▶ Resume".
 * @param {() => void} props.onPlayClick - Called when the play/pause/resume button is clicked.
 */
export default function EpisodeItem({
  episode,
  subtitle,
  progress,
  favourited,
  onToggleFavourite,
  playLabel,
  onPlayClick,
}) {
  const subtitleLines = Array.isArray(subtitle) ? subtitle : [subtitle];

  return (
    <div className="episode-item">
      <div className="episode-item__info">
        <h3>{episode.episode}. {episode.title}</h3>
        {subtitleLines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
        {progress && (
          <div className="episode-progress">
            <div className="episode-progress__bar" style={{ width: `${progress.percent}%` }} />
          </div>
        )}
        {progress?.finished && <span className="episode-progress__label">Finished</span>}
      </div>

      <div className="episode-item__actions">
        <button
          onClick={onToggleFavourite}
          className={`favourite-button ${favourited ? "favourite-button--active" : ""}`}
          aria-label={favourited ? "Remove from favourites" : "Add to favourites"}
        >
          {favourited ? "♥" : "♡"}
        </button>
        <button onClick={onPlayClick} className="play-button">
          {playLabel}
        </button>
      </div>
    </div>
  );
}
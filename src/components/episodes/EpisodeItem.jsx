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
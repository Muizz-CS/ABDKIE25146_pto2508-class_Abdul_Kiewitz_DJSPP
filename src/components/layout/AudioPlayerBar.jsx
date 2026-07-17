import { useAudioPlayer } from "../../context/AudioPlayerContext";
import { formatTime } from "../../utils/formatTime";

/**
 * Global audio player bar, fixed to the bottom of the screen and rendered
 * once at the top of the app (outside the router's Routes) so it persists
 * across navigation. Renders nothing until an episode has been played at
 * least once. Takes no props — reads/writes playback state via `useAudioPlayer`.
 */
export default function AudioPlayerBar() {
  const { currentEpisode, isPlaying, currentTime, duration, togglePlay, seek } = useAudioPlayer();

  if (!currentEpisode) return null;

  /** Seeks playback to the position dragged to on the range input. */
  function handleSeek(e) {
    seek(Number(e.target.value));
  }

  return (
    <div className="audio-player-bar">
      <div className="audio-player-bar__info">
        <strong>{currentEpisode.title}</strong>
        <span>{currentEpisode.showTitle} · {currentEpisode.seasonTitle}</span>
      </div>

      <div className="audio-player-bar__controls">
        <button onClick={togglePlay} className="audio-player-bar__play-btn">
          {isPlaying ? "⏸" : "▶"}
        </button>

        <span className="audio-player-bar__time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min={0}
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="audio-player-bar__seek"
        />
        <span className="audio-player-bar__time">{formatTime(duration)}</span>
      </div>
    </div>
  );
}
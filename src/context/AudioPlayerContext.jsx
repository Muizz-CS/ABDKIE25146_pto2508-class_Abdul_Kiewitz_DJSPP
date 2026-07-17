import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useListeningProgress } from "./ListeningProgressContext";

const AudioPlayerContext = createContext(null);
const SAVE_INTERVAL_SECONDS = 5;

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const loadedKeyRef = useRef(null);
  const lastSavedTimeRef = useRef(0);
  const pendingResumeRef = useRef(null);

  const { getProgress, saveProgress, markFinished } = useListeningProgress();

  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load a new episode when it changes, looking up any saved position first.
  // Sync play/pause state on every change either way.
  useEffect(() => {
    const audio = audioRef.current;
    if (!currentEpisode) return;

    const episodeKey = `${currentEpisode.showId}-${currentEpisode.seasonTitle}-${currentEpisode.episode}`;

    if (loadedKeyRef.current !== episodeKey) {
      loadedKeyRef.current = episodeKey;
      audio.src = currentEpisode.file;
      audio.load();
      setCurrentTime(0);
      lastSavedTimeRef.current = 0;

      const saved = getProgress(currentEpisode.showId, currentEpisode.seasonTitle, currentEpisode.episode);
      pendingResumeRef.current = saved && !saved.finished ? saved.position : null;
    }

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpisode, isPlaying]);

  // Keep progress + duration in sync, throttle saves to every ~5s of playback,
  // apply the resume position once metadata is loaded, and mark finished on ended.
  useEffect(() => {
    const audio = audioRef.current;

    function handleTimeUpdate() {
      setCurrentTime(audio.currentTime);

      if (
        currentEpisode &&
        Math.abs(audio.currentTime - lastSavedTimeRef.current) >= SAVE_INTERVAL_SECONDS
      ) {
        lastSavedTimeRef.current = audio.currentTime;
        saveProgress(
          currentEpisode.showId,
          currentEpisode.seasonTitle,
          currentEpisode.episode,
          audio.currentTime,
          audio.duration || 0
        );
      }
    }

    function handleLoadedMetadata() {
      setDuration(audio.duration || 0);
      if (pendingResumeRef.current) {
        audio.currentTime = pendingResumeRef.current;
        setCurrentTime(pendingResumeRef.current);
        pendingResumeRef.current = null;
      }
    }

    function handleEnded() {
      setIsPlaying(false);
      if (currentEpisode) {
        markFinished(currentEpisode.showId, currentEpisode.seasonTitle, currentEpisode.episode);
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpisode]);

  useEffect(() => {
    function handleBeforeUnload(e) {
      if (isPlaying) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isPlaying]);

  function playEpisode(episode) {
    setCurrentEpisode(episode);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying((prev) => !prev);
  }

  function seek(time) {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        currentTime,
        duration,
        playEpisode,
        togglePlay,
        seek,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) throw new Error("useAudioPlayer must be used within AudioPlayerProvider");
  return ctx;
}
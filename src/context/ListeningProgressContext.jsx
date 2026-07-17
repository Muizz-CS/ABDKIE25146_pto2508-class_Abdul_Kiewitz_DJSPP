import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const ListeningProgressContext = createContext(null);

function makeProgressKey(showId, seasonTitle, episodeNumber) {
  return `${showId}-${seasonTitle}-${episodeNumber}`;
}

export function ListeningProgressProvider({ children }) {
  const [progress, setProgress] = useLocalStorage("listeningProgress", {});

  function getProgress(showId, seasonTitle, episodeNumber) {
    const key = makeProgressKey(showId, seasonTitle, episodeNumber);
    return progress[key] || null;
  }

  function saveProgress(showId, seasonTitle, episodeNumber, position, duration) {
    const key = makeProgressKey(showId, seasonTitle, episodeNumber);
    setProgress((prev) => ({
      ...prev,
      [key]: {
        position,
        duration,
        finished: prev[key]?.finished || false,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function markFinished(showId, seasonTitle, episodeNumber) {
    const key = makeProgressKey(showId, seasonTitle, episodeNumber);
    setProgress((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        finished: true,
        updatedAt: new Date().toISOString(),
      },
    }));
  }

  function resetProgress() {
    setProgress({});
  }

  return (
    <ListeningProgressContext.Provider
      value={{ progress, getProgress, saveProgress, markFinished, resetProgress }}
    >
      {children}
    </ListeningProgressContext.Provider>
  );
}

export function useListeningProgress() {
  const ctx = useContext(ListeningProgressContext);
  if (!ctx) throw new Error("useListeningProgress must be used within ListeningProgressProvider");
  return ctx;
}
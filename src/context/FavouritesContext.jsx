import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FavouritesContext = createContext(null);

function makeFavouriteId(showId, seasonTitle, episodeNumber) {
  return `${showId}-${seasonTitle}-${episodeNumber}`;
}

export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useLocalStorage("favourites", []);

  function isFavourite(showId, seasonTitle, episodeNumber) {
    const id = makeFavouriteId(showId, seasonTitle, episodeNumber);
    return favourites.some((fav) => fav.id === id);
  }

  function addFavourite(episode) {
    const id = makeFavouriteId(episode.showId, episode.seasonTitle, episode.episode);
    setFavourites((prev) => {
      if (prev.some((fav) => fav.id === id)) return prev;
      return [...prev, { ...episode, id, addedAt: new Date().toISOString() }];
    });
  }

  function removeFavourite(showId, seasonTitle, episodeNumber) {
    const id = makeFavouriteId(showId, seasonTitle, episodeNumber);
    setFavourites((prev) => prev.filter((fav) => fav.id !== id));
  }

  function toggleFavourite(episode) {
    const id = makeFavouriteId(episode.showId, episode.seasonTitle, episode.episode);
    if (favourites.some((fav) => fav.id === id)) {
      removeFavourite(episode.showId, episode.seasonTitle, episode.episode);
    } else {
      addFavourite(episode);
    }
  }

  return (
    <FavouritesContext.Provider
      value={{ favourites, isFavourite, addFavourite, removeFavourite, toggleFavourite }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}
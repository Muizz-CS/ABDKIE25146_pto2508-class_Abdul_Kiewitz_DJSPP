import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { useListeningProgress } from "../../context/ListeningProgressContext";

/**
 * Site header shown on every page: logo/home link, nav (Shows/Favourites),
 * a reset-listening-history button, and the theme toggle. Takes no props —
 * everything it needs comes from context.
 */
export default function Header() {
  const { resetProgress } = useListeningProgress();

  /** Confirms with the user, then wipes all saved listening progress. */
  function handleReset() {
    if (window.confirm("Reset all listening history? This can't be undone.")) {
      resetProgress();
    }
  }

  return (
    <header className="app-header">
      <Link to="/" className="app-header__logo">🎙️ Podcast App</Link>

      <nav className="app-header__nav">
        <Link to="/">Shows</Link>
        <Link to="/favourites">Favourites</Link>
      </nav>

      <div className="app-header__controls">
        <button onClick={handleReset} className="reset-progress-button" title="Reset listening history">
          🗑
        </button>
        <ThemeToggle />
      </div>
    </header>
  );
}
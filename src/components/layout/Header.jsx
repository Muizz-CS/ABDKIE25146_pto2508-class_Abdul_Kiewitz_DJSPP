import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="app-header__logo">🎙️ Podcast App</Link>

      <nav className="app-header__nav">
        <Link to="/">Shows</Link>
        <Link to="/favourites">Favourites</Link>
      </nav>

      <ThemeToggle />
    </header>
  );
}
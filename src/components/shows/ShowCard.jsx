import { Link } from "react-router-dom";

/**
 * A clickable preview card for a show: image, title, season count, and
 * resolved genre tags. Links to the show's detail page. Used in the
 * landing page grid.
 *
 * @param {object} props
 * @param {object} props.show - Show preview object (id, title, image, seasons, genres [ids]).
 * @param {Object<string, string>} props.genreTitles - Map of genre id to genre title, used to resolve `show.genres` to display names.
 */
export default function ShowCard({ show, genreTitles }) {
  const genreNames = (show.genres || []).map((id) => genreTitles[id] || "…");

  return (
    <Link to={`/show/${show.id}`} className="show-card">
      <img src={show.image} alt={show.title} className="show-card__image" />
      <div className="show-card__body">
        <h3 className="show-card__title">{show.title}</h3>
        <p className="show-card__meta">
          {show.seasons} season{show.seasons !== 1 ? "s" : ""}
        </p>
        <div className="show-card__genres">
          {genreNames.map((name) => (
            <span key={name} className="genre-tag">{name}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
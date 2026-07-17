import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { shuffle } from "../../utils/shuffle";

const RECOMMENDED_COUNT = 10;

export default function RecommendedCarousel({ shows, genreTitles }) {
  const trackRef = useRef(null);

  const recommended = useMemo(
    () => shuffle(shows).slice(0, RECOMMENDED_COUNT),
    [shows]
  );

  function scrollByAmount(direction) {
    const el = trackRef.current;
    if (!el) return;

    const atStart = el.scrollLeft <= 5;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 5;

    if (direction === "next" && atEnd) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === "prev" && atStart) {
      el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    } else {
      el.scrollBy({
        left: direction === "next" ? el.clientWidth * 0.8 : -el.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  }

  if (recommended.length === 0) return null;

  return (
    <section className="carousel">
      <h2 className="carousel__heading">Recommended for you</h2>

      <div className="carousel__track" ref={trackRef}>
        {recommended.map((show) => (
          <Link key={show.id} to={`/show/${show.id}`} className="carousel__item">
            <img src={show.image} alt={show.title} className="carousel__image" />
            <div className="carousel__body">
              <h3 className="carousel__title">{show.title}</h3>
              <div className="show-card__genres">
                {(show.genres || []).map((id) => (
                  <span key={id} className="genre-tag">
                    {genreTitles[id] || "…"}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="carousel__arrows">
        <button
          onClick={() => scrollByAmount("prev")}
          className="carousel__arrow"
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          onClick={() => scrollByAmount("next")}
          className="carousel__arrow"
          aria-label="Next"
        >
          ›
        </button>
      </div>
    </section>
  );
}
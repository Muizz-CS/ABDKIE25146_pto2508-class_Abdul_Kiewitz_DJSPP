/**
 * Tab bar for switching between a show's seasons.
 *
 * @param {object} props
 * @param {Array<object>} props.seasons - The show's seasons, each with `season` (number) and `title`.
 * @param {number} props.activeIndex - Index (into `seasons`) of the currently selected season.
 * @param {(index: number) => void} props.onSelect - Called with the clicked season's index.
 */
export default function SeasonTabs({ seasons, activeIndex, onSelect }) {
  return (
    <div className="season-tabs">
      {seasons.map((s, index) => (
        <button
          key={s.season}
          className={`season-tab ${index === activeIndex ? "season-tab--active" : ""}`}
          onClick={() => onSelect(index)}
        >
          {s.title}
        </button>
      ))}
    </div>
  );
}
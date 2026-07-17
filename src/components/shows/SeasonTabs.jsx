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
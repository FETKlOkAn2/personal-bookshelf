const FILTERS = [
  { label: "All",          value: null },
  { label: "Want to read", value: "want_to_read" },
  { label: "Reading",      value: "reading" },
  { label: "Finished",     value: "finished" },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="filters">
      {FILTERS.map(f => (
        <button
          key={f.label}
          className={`filter-btn ${active === f.value ? "active" : ""}`}
          onClick={() => onChange(f.value)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
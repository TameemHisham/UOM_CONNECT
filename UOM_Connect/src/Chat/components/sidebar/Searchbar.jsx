import "./SearchBar.css";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="wrapper">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2.5"
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        className="searchbar--input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search groups..."
      />
    </div>
  );
}

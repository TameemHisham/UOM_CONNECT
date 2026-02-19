import { useState } from "react";
import SearchBar from "./SearchBar";
import GroupListItem from "./GroupListItem";
import "./Sidebar.css";

/**
 * Sidebar
 * Props:
 *   groups          (array)  – full list of group objects
 *   selectedGroupId (number) – currently active group id
 *   onSelectGroup   (fn)     – called with group id when a row is clicked
 */
export default function Sidebar({ groups, selectedGroupId, onSelectGroup }) {
  const [search, setSearch] = useState("");

  const filtered = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar--header">
        <div className="logo">
          <div className="logoIcon">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="logoText">Study Groups</span>
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Group list */}
      <div className="list">
        {filtered.map((group) => (
          <GroupListItem
            key={group.id}
            group={group}
            isActive={selectedGroupId === group.id}
            onClick={() => onSelectGroup(group.id)}
          />
        ))}
      </div>
    </aside>
  );
}

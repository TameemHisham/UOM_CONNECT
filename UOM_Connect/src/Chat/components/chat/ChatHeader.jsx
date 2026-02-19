import Avatar from "../Avatar";
import "./ChatHeader.css";

/**
 * ChatHeader
 * Props:
 *   group (object) – the currently selected group
 */
export default function ChatHeader({ group }) {
  if (!group) return null;

  return (
    <header className="header">
      <Avatar loc="header" initials={group.initials} size={40} />

      <div className="info">
        <p className="header_name">{group.name}</p>
        <p className="members">{group.members} members</p>
      </div>

      <div className="actions">
        <button className="btn" title="Members">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </button>
        <button className="btn" title="More options">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
    </header>
  );
}

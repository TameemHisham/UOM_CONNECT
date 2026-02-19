import Avatar from "../Avatar";
import "./GroupListItem.css";

/**
 * GroupListItem
 * Props:
 *   group    (object)  – group data object
 *   isActive (boolean) – highlights the row when true
 *   onClick  (fn)      – called when the row is clicked
 */
export default function GroupListItem({ group, isActive, onClick }) {
  return (
    <div className={`item ${isActive ? "active" : ""}`} onClick={onClick}>
      <Avatar loc={""} initials={group.initials} size={42} />

      <div className="info">
        <div className="topRow">
          <span className="name">{group.name}</span>
          <span className="time">{group.time}</span>
        </div>

        <div className="bottomRow">
          <span className="lastMessage">{group.lastMessage}</span>
          {group.unread > 0 && <span className="badge">{group.unread}</span>}
        </div>
      </div>
    </div>
  );
}

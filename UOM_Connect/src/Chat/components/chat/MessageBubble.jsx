import Avatar from "../Avatar";
import "./MessageBubble.css";

/**
 * MessageBubble
 * Props:
 *   message (object) – { id, sender, initials, text, time, own }
 */
export default function MessageBubble({ message }) {
  const { sender, initials, text, time, own } = message;

  return (
    <div className={`row ${own ? "own" : ""}`}>
      {!own && <Avatar loc="header" initials={initials} size={34} />}

      <div className="content">
        {!own && <span className="sender">{sender}</span>}
        <div className={`bubble ${own ? "bubbleOwn" : "bubbleOther"}`}>
          {text}
        </div>
        <span className="time">{time}</span>
      </div>
    </div>
  );
}

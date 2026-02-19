import styles from "./MessageBubble.module.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MessageBubble({ message }) {
  const { sender, text, time, own } = message;
  return (
    <div className={`${styles.row} ${own ? styles.own : ""}`}>
      {!own && <div className={styles.avatar}>{getInitials(sender)}</div>}
      <div className={styles.content}>
        {!own && <span className={styles.sender}>{sender}</span>}
        <div
          className={`${styles.bubble} ${own ? styles.bubbleOwn : styles.bubbleOther}`}
        >
          {text}
        </div>
        <span className={styles.time}>{time}</span>
      </div>
    </div>
  );
}

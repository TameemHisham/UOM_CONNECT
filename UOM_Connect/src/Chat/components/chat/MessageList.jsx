import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import styles from "./MessageList.module.css";

export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={styles.list}>
      {messages.length === 0 && (
        <p className={styles.empty}>No messages yet. Say hello! 👋</p>
      )}
      {messages.map((msg, i) => (
        <MessageBubble key={msg.id ?? i} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

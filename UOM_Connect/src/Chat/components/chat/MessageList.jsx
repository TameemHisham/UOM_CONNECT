import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import "./MessageList.css";

/**
 * MessageList
 * Scrollable container for all messages. Auto-scrolls to latest.
 * Props:
 *   messages (array) – array of message objects for the active group
 */
export default function MessageList({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="list">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

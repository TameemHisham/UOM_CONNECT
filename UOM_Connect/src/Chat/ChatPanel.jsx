import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import styles from "./ChatPanel.module.css";

/**
 * ChatPanel
 * Composes the right side of the chat layout.
 * Props:
 *   group    (object) – currently selected group
 *   messages (array)  – messages for the selected group
 *   onSend   (fn)     – called with message text on submit
 */
export default function ChatPanel({ group, messages, onSend }) {
  return (
    <div className={styles.panel}>
      <ChatHeader group={group} />
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </div>
  );
}

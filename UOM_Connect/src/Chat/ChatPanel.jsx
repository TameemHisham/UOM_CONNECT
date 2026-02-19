import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import styles from "./ChatPanel.module.css";

export default function ChatPanel({ group, messages, onSend }) {
  return (
    <div className={styles.panel}>
      <ChatHeader group={group} />
      <MessageList messages={messages} />
      <MessageInput onSend={onSend} />
    </div>
  );
}

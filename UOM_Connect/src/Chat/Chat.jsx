import { useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import ChatPanel from "./components/chat/ChatPanel";
import { groups, messagesByGroup } from "./data/mockData";
import "./Chat.css";

/**
 * Chat
 * Top-level chat page. Already wired into App.jsx via the /chat protected route.
 * Owns the shared state: which group is selected and all messages.
 */
function Chat() {
  const [selectedGroupId, setSelectedGroupId] = useState(1);
  const [allMessages, setAllMessages] = useState(messagesByGroup);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId);
  const currentMessages = allMessages[selectedGroupId] || [];

  const handleSend = (text) => {
    const newMessage = {
      id: Date.now(),
      sender: "You",
      initials: "YO",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      own: true,
    };

    setAllMessages((prev) => ({
      ...prev,
      [selectedGroupId]: [...(prev[selectedGroupId] || []), newMessage],
    }));
  };

  return (
    <div className="page">
      <div className="container">
        <Sidebar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
        />
        <ChatPanel
          group={selectedGroup}
          messages={currentMessages}
          onSend={handleSend}
        />
      </div>
    </div>
  );
}

export default Chat;

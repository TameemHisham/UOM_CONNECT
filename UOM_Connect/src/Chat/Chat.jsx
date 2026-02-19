import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import ChatPanel from "./components/chat/ChatPanel";
import { getCurrentUser } from "../api/auth";
import { getUserGroups } from "../api/groups";
import { getToken, clearToken } from "../utils/auth";
import "./Chat.css";

function Chat() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [wsStatus, setWsStatus] = useState("disconnected"); // "connecting" | "connected" | "disconnected"
  const socketRef = useRef(null);

  // On mount: load user + groups
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    getCurrentUser(token)
      .then((data) => setUser(data.user))
      .catch(() => {
        clearToken();
        navigate("/login");
      });

    getUserGroups(token)
      .then((data) => setGroups(data || []))
      .catch(console.error);
  }, []);

  // WebSocket: connect when group + user are ready
  useEffect(() => {
    if (!selectedGroupId || !user) return;

    // Close previous socket
    if (socketRef.current) socketRef.current.close();

    setMessages([]);
    setWsStatus("connecting");

    const ws = new WebSocket(
      `ws://localhost:8000/ws/${selectedGroupId}/${encodeURIComponent(user.sub)}`,
    );
    socketRef.current = ws;

    ws.onopen = () => setWsStatus("connected");
    ws.onclose = () => setWsStatus("disconnected");
    ws.onerror = () => setWsStatus("disconnected");

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            sender: data.sender,
            text: data.text,
            time: data.time,
            own: data.sender === user.sub,
          },
        ]);
      } catch (e) {
        console.error("Bad WS message", e);
      }
    };

    return () => ws.close();
  }, [selectedGroupId, user]);

  const handleSend = (text) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(text);
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  return (
    <div className="chatPage">
      <div className="chatContainer">
        <Sidebar
          groups={groups}
          selectedGroupId={selectedGroupId}
          onSelectGroup={setSelectedGroupId}
          onGroupsChange={setGroups}
          currentUser={user}
        />

        {selectedGroupId ? (
          <div className="chatMain">
            {wsStatus === "connecting" && (
              <div className="wsBar wsConnecting">Connecting…</div>
            )}
            {wsStatus === "disconnected" && (
              <div className="wsBar wsDisconnected">
                Disconnected — messages won't send
              </div>
            )}
            <ChatPanel
              group={selectedGroup}
              messages={messages}
              onSend={handleSend}
            />
          </div>
        ) : (
          <div className="welcomeScreen">
            <div className="welcomeIcon">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B2C91"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="welcomeTitle">Welcome to UOM Connect</h2>
            <p className="welcomeSub">
              Select a group to start chatting, or create a new one from the
              sidebar.
            </p>
          </div>
        )}
      </div>

      {/* Logout button — top right */}
      <button className="logoutBtn" onClick={handleLogout} title="Sign out">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}

export default Chat;

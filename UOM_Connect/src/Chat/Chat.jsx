import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import ChatPanel from "./components/chat/ChatPanel";
import { getCurrentUser } from "../api/auth";
import { getUserGroups, getGroupMessages } from "../api/groups";
import "./Chat.css";
import { getToken } from "../utils/auth";
import "./Chat.css";
// const WEBSOCKET_ENDPOINT = import.meta.env.WEBSOCKET_ENDPOINT;

function Chat() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [groups, setGroups] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [wsStatus, setWsStatus] = useState("disconnected");
  const socketRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate("/login");
      return;
    }

    getCurrentUser(token)
      .then((data) => setUser(data.user))
      .catch(() => {
        // clearToken();
        navigate("/login");
      });

    getUserGroups(token)
      .then((data) => setGroups(data || []))
      .catch(console.error);
  }, [navigate]);

  useEffect(() => {
    if (!selectedGroupId || !user) return;

    // Close previous socket
    if (socketRef.current) socketRef.current.close();

    setMessages([]);
    setWsStatus("connecting");
    const token = getToken();

    // Fetch message history first
    const loadHistoryAndConnect = async () => {
      try {
        const history = await getGroupMessages(selectedGroupId, token);
        // Map the history to include the 'own' flag so styling works correctly
        const formattedHistory = history.map((msg) => ({
          ...msg,
          own: msg.sender === user.sub,
        }));
        setMessages(formattedHistory);
      } catch (err) {
        console.error("Failed to load message history:", err);
      }

      // Then establish the WebSocket connection
      // const ws = new WebSocket(
      // `ws://http://10.204.191.97:5173/ws/${selectedGroupId}/${encodeURIComponent(user.sub)}`,
      //
      // );
      // const ws = new WebSocket(
      //   `ws://10.204.191.97:8000/ws/${selectedGroupId}/${encodeURIComponent(user.sub)}`,
      // );
      const ws = new WebSocket(
        `wss://unlucent-averie-unprecipitantly.ngrok-free.dev/ws/${selectedGroupId}/${encodeURIComponent(user.sub)}`,
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
              id: Date.now() + Math.random(), // Unique ID for key mapping
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
    };

    loadHistoryAndConnect();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [selectedGroupId, user]);

  // Handles the selected group from the profile page
  useEffect(() => {
    if (location.state?.groupId) {
      setSelectedGroupId(location.state.groupId);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleSend = (text) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(text);
    }
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
    </div>
  );
}

export default Chat;

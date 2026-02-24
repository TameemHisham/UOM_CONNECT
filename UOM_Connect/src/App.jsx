import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoginForm from "./LoginForm/LoginForm";
import SignupForm from "./SignupForm/SignupForm";
import ProfilePage from "./ProfilePage/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./Chat/Chat";
import JoinPage from "./JoinPage/JoinPage";
import { getToken } from "./utils/auth";
import { joinGroup } from "./api/groups";
import "./App.css";

// After login, auto-join if a pending code was saved by the JoinPage
function PendingJoinHandler() {
  const navigate = useNavigate();
  useEffect(() => {
    const code = sessionStorage.getItem("pendingJoinCode");
    if (!code) return;
    sessionStorage.removeItem("pendingJoinCode");
    const token = getToken();
    if (token) {
      joinGroup(token, code)
        .then(() => navigate("/chat"))
        .catch(() => navigate("/chat"));
    }
  }, []);
  return null;
}

function App() {
  return (
    <>
      <PendingJoinHandler />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/join/:code" element={<JoinPage />} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;

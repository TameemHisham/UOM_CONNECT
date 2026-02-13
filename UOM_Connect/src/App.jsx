import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm/LoginForm";
import SignupForm from "./SignupForm/SignupForm";
import ProtectedRoute from "./components/ProtectedRoute";
// import getCurrentUser from "./api/auth";
import "./App.css";
import Chat from "./Chat/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;

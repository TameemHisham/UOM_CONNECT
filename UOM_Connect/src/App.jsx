import { Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm/LoginForm";
import SignupForm from "./SignupForm/SignupForm";
// import getCurrentUser from "./api/auth";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/login" />} />
      {/* <Route path="/chat" element={<h1>{console.log(getCurrentUser(localStorage.getItem("token")))}</h1>} /> */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
    </Routes>
  );
}

export default App;

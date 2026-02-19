import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinGroup } from "../api/groups";
import { getToken, checkAuth } from "../utils/auth";

export default function JoinPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking | joining | done | error | needsLogin
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const run = async () => {
      const authed = await checkAuth();
      if (!authed) {
        // Save code to sessionStorage so after login we can auto-join
        sessionStorage.setItem("pendingJoinCode", code);
        setStatus("needsLogin");
        return;
      }
      setStatus("joining");
      try {
        const res = await joinGroup(getToken(), code);
        setMsg(`Joined "${res.group.name}"!`);
        setStatus("done");
        setTimeout(() => navigate("/chat"), 1500);
      } catch (e) {
        setStatus("error");
        setMsg(e.message);
      }
    };
    run();
  }, [code]);

  const styles = {
    page: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg,#4e1f6b,#2e1040)",
      fontFamily: "'DM Sans',sans-serif",
    },
    card: {
      background: "#fff",
      borderRadius: 16,
      padding: "40px 36px",
      width: 360,
      textAlign: "center",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
      color: "#1e0a2e",
      marginBottom: 10,
    },
    sub: { fontSize: 14, color: "#6b7280", marginBottom: 24, lineHeight: 1.6 },
    btn: {
      padding: "11px 28px",
      background: "#6B2C91",
      border: "none",
      borderRadius: 10,
      color: "#fff",
      fontSize: 14,
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "inherit",
    },
    code: {
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: "0.15em",
      color: "#6B2C91",
      fontFamily: "monospace",
      margin: "12px 0",
    },
  };

  if (status === "checking" || status === "joining")
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={styles.title}>
            {status === "checking" ? "Checking…" : "Joining group…"}
          </p>
          <p style={styles.sub}>Please wait a moment.</p>
        </div>
      </div>
    );

  if (status === "needsLogin")
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={styles.title}>You're invited!</p>
          <div style={styles.code}>{code}</div>
          <p style={styles.sub}>
            Log in or sign up first, then you'll be joined automatically.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button style={styles.btn} onClick={() => navigate("/login")}>
              Log In
            </button>
            <button
              style={{
                ...styles.btn,
                background: "#fff",
                color: "#6B2C91",
                border: "1.5px solid #6B2C91",
              }}
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );

  if (status === "done")
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p style={{ fontSize: 36, marginBottom: 8 }}>🎉</p>
          <p style={styles.title}>{msg}</p>
          <p style={styles.sub}>Taking you to the chat…</p>
        </div>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <p style={{ fontSize: 36, marginBottom: 8 }}>😕</p>
        <p style={styles.title}>Couldn't join</p>
        <p style={styles.sub}>{msg}</p>
        <button style={styles.btn} onClick={() => navigate("/chat")}>
          Go to Chat
        </button>
      </div>
    </div>
  );
}

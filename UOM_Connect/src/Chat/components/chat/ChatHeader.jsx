import { useState } from "react";
import { sendInviteEmail } from "../../../api/groups";
import { getToken } from "../../../utils/auth";
import styles from "./ChatHeader.module.css";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ChatHeader({ group }) {
  const [showShare, setShowShare] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState(null); // "sending" | "sent" | "error"
  const [copied, setCopied] = useState(false);

  if (!group) return null;

  const joinLink = `${window.location.origin}/join/${group.join_code}`;

  const copyLink = () => {
    navigator.clipboard.writeText(joinLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(group.join_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviteStatus("sending");
    try {
      await sendInviteEmail(inviteEmail.trim(), group.join_code, getToken());
      setInviteStatus("sent");
      setInviteEmail("");
    } catch {
      setInviteStatus("error");
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.avatarBox}>{getInitials(group.name)}</div>
        <div className={styles.info}>
          <p className={styles.name}>{group.name}</p>
          <p className={styles.meta}>
            {group.member_count ?? 0} members · #{group.join_code}
          </p>
        </div>
        <button className={styles.shareBtn} onClick={() => setShowShare(true)}>
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          Invite
        </button>
      </header>

      {showShare && (
        <div className={styles.overlay} onClick={() => setShowShare(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Invite to {group.name}</h3>
              <button
                className={styles.closeBtn}
                onClick={() => setShowShare(false)}
              >
                ✕
              </button>
            </div>

            <p className={styles.label}>Join Code</p>
            <div className={styles.codeRow}>
              <span className={styles.code}>{group.join_code}</span>
              <button className={styles.copyBtn} onClick={copyCode}>
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>

            <p className={styles.label} style={{ marginTop: 16 }}>
              Share Link
            </p>
            <div className={styles.linkRow}>
              <span className={styles.link}>{joinLink}</span>
              <button className={styles.copyBtn} onClick={copyLink}>
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>

            <p className={styles.label} style={{ marginTop: 16 }}>
              Send Email Invite
            </p>
            <div className={styles.emailRow}>
              <input
                className={styles.emailInput}
                placeholder="friend@student.manchester.ac.uk"
                value={inviteEmail}
                onChange={(e) => {
                  setInviteEmail(e.target.value);
                  setInviteStatus(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSendInvite()}
              />
              <button
                className={styles.sendBtn}
                onClick={handleSendInvite}
                disabled={inviteStatus === "sending"}
              >
                {inviteStatus === "sending" ? "Sending..." : "Send"}
              </button>
            </div>
            {inviteStatus === "sent" && (
              <p className={styles.successMsg}>✓ Invite sent!</p>
            )}
            {inviteStatus === "error" && (
              <p className={styles.errorMsg}>Failed to send invite.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

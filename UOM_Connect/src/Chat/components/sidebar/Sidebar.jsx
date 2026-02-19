import { useState } from "react";
import styles from "./Sidebar.module.css";
import { createGroup, joinGroup } from "../../../api/groups";
import { getToken } from "../../../utils/auth";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function GroupItem({ group, isActive, onClick }) {
  return (
    <div
      className={`${styles.groupItem} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <div className={styles.avatar}>{getInitials(group.name)}</div>
      <div className={styles.groupInfo}>
        <div className={styles.groupName}>{group.name}</div>
        <div className={styles.groupMeta}>
          {group.member_count ?? 0} members · #{group.join_code}
        </div>
      </div>
    </div>
  );
}
export default function Sidebar({
  groups,
  selectedGroupId,
  onSelectGroup,
  onGroupsChange,
  currentUser,
}) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [inputVal, setInputVal] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = groups.filter((g) =>
    g?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  const openModal = (type) => {
    setModal(type);
    setInputVal("");
    setError("");
  };

  const closeModal = () => {
    setModal(null);
    setInputVal("");
    setError("");
  };

  const handleCreate = async () => {
    if (!inputVal.trim()) return setError("Enter a group name");
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const newGroup = await createGroup(inputVal.trim(), token);
      onGroupsChange([...groups, newGroup]);
      onSelectGroup(newGroup.id);
      closeModal();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inputVal.trim()) return setError("Enter a join code");
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const res = await joinGroup(inputVal.trim(), token);
      const already = groups.find((g) => g.id === res.group.id);
      if (!already) onGroupsChange([...groups, res.group]);
      onSelectGroup(res.group.id);
      closeModal();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandIcon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className={styles.brandName}>UOM Connect</span>
        </div>
        {currentUser && (
          <div className={styles.userChip}>
            <div className={styles.userDot} />
            <span>{currentUser.sub}</span>
          </div>
        )}
      </div>

      <div className={styles.searchWrap}>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Search groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.actions}>
        <button
          className={styles.actionBtn}
          onClick={() => openModal("create")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Group
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnOutline}`}
          onClick={() => openModal("join")}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          Join Group
        </button>
      </div>

      <div className={styles.list}>
        {filtered.length === 0 && (
          <p className={styles.emptyHint}>
            {groups.length === 0
              ? "No groups yet — create or join one!"
              : "No groups match your search."}
          </p>
        )}
        {filtered.map((g) => (
          <GroupItem
            key={g.id}
            group={g}
            isActive={selectedGroupId === g.id}
            onClick={() => onSelectGroup(g.id)}
          />
        ))}
      </div>

      {modal && (
        <div className={styles.overlay} onClick={closeModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {modal === "create" ? "Create a new group" : "Join a group"}
            </h3>
            <p className={styles.modalSub}>
              {modal === "create"
                ? "Give your group a name. A unique join code will be generated automatically."
                : "Enter the 6-character join code shared with you."}
            </p>
            <input
              className={styles.modalInput}
              placeholder={
                modal === "create" ? "e.g. CS Study Squad" : "e.g. A1B2C3"
              }
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                (modal === "create" ? handleCreate() : handleJoin())
              }
              autoFocus
            />
            {error && <p className={styles.modalError}>{error}</p>}
            <div className={styles.modalBtns}>
              <button className={styles.modalCancel} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={modal === "create" ? handleCreate : handleJoin}
                disabled={loading}
              >
                {loading ? "..." : modal === "create" ? "Create" : "Join"}
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

import "./Avatar.css";

/**
 * Avatar
 * Props:
 *   initials (string) – shown inside the circle
 *   size     (number) – diameter in px (default 36)
 */
export default function Avatar({ loc, initials, size = 36 }) {
  const bg = loc != "header" ? "rgba(242, 242, 242, 0.2)" : "#6B2C91";

  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.35,
      }}
    >
      {initials}
    </div>
  );
}

import "./Avatar.css";

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

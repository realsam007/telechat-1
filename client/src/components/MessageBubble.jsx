import "./MessageBubble.css";

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

// DateDivider: shown when message date changes
export function DateDivider({ dateStr }) {
  return (
    <div className="date-divider">
      <span>{formatDate(dateStr)}</span>
    </div>
  );
}

// SystemMessage: join/leave notifications
export function SystemMessage({ text }) {
  return (
    <div className="system-message">
      <span>{text}</span>
    </div>
  );
}

// Main MessageBubble
export default function MessageBubble({ message, isSelf, showSender }) {
  const { from, text, createdAt } = message;

  return (
    <div className={`bubble-wrapper ${isSelf ? "self" : "other"}`}>
      {/* Sender avatar + name for others */}
      {!isSelf && showSender && (
        <div className="bubble-avatar" title={from}>
          {from.charAt(0).toUpperCase()}
        </div>
      )}
      {!isSelf && !showSender && <div className="bubble-avatar-spacer" />}

      <div className="bubble-content">
        {!isSelf && showSender && (
          <span className="bubble-sender">{from}</span>
        )}
        <div className={`bubble ${isSelf ? "bubble-self" : "bubble-other"}`}>
          <p className="bubble-text">{text}</p>
          <span className="bubble-time">{formatTime(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

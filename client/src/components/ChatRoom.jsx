import { useEffect, useRef, useState, useCallback } from "react";
import MessageBubble, { DateDivider, SystemMessage } from "./MessageBubble";
import MessageInput from "./MessageInput";
import Sidebar from "./Sidebar";
import "./ChatRoom.css";



function isSameDay(d1, d2) {
  const a = new Date(d1);
  const b = new Date(d2);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function ChatRoom({ username, room, socket, onLeave }) {
  const [messages, setMessages] = useState([]);      // { type: 'msg'|'system', ...data }
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState(null);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  // ── Fetch message history ─────────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    fetch(`/api/messages/${room}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const history = data.messages.map((m) => ({ type: "msg", ...m }));
          setMessages(history);
        }
      })
      .catch(() => {
        setSocketError("Could not load message history.");
      })
      .finally(() => setLoading(false));
  }, [room]);

  // ── Socket events ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Join the room
    socket.joinRoom(username, room);

    // Incoming message
    const offMsg = socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, { type: "msg", ...msg }]);
    });

    // System message (join/leave)
    const offSys = socket.on("system_message", (msg) => {
      setMessages((prev) => [...prev, { type: "system", ...msg }]);
    });

    // Online users list
    const offUsers = socket.on("room_users", ({ users }) => {
      setOnlineUsers(users);
    });

    // Typing
    const offTyping = socket.on("user_typing", ({ username: typer }) => {
      setTypingUser(typer);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTypingUser(null), 2500);
    });

    const offStopTyping = socket.on("user_stop_typing", () => {
      setTypingUser(null);
    });

    // Error
    const offErr = socket.on("message_error", ({ error }) => {
      setSocketError(error);
      setTimeout(() => setSocketError(null), 4000);
    });

    return () => {
      offMsg();
      offSys();
      offUsers();
      offTyping();
      offStopTyping();
      offErr();
    };
  }, [username, room, socket]);

  // ── Auto-scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUser]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSend = useCallback(
    (text) => {
      socket.sendMessage(username, room, text);
    },
    [socket, username, room]
  );

  const handleTyping = useCallback(
    () => socket.emitTyping(username, room),
    [socket, username, room]
  );

  const handleStopTyping = useCallback(
    () => socket.emitStopTyping(room),
    [socket, room]
  );

  // ── Render messages with date dividers ───────────────────────────────────
  const renderMessages = () => {
    const items = [];
    let lastDate = null;

    messages.forEach((msg, idx) => {
      if (msg.type === "system") {
        items.push(<SystemMessage key={`sys-${idx}`} text={msg.text} />);
        return;
      }

      const msgDate = msg.createdAt;
      if (!lastDate || !isSameDay(lastDate, msgDate)) {
        items.push(<DateDivider key={`date-${idx}`} dateStr={msgDate} />);
        lastDate = msgDate;
      }

      const isSelf = msg.from === username;
      // Show sender name if previous message is from a different user
      const prevMsg = messages[idx - 1];
      const showSender =
        !isSelf &&
        (!prevMsg || prevMsg.type === "system" || prevMsg.from !== msg.from);

      items.push(
        <MessageBubble
          key={msg._id || idx}
          message={msg}
          isSelf={isSelf}
          showSender={showSender}
        />
      );
    });

    return items;
  };

  return (
    <div className="chatroom-layout">
      <Sidebar
        username={username}
        currentRoom={room}
        onlineUsers={onlineUsers}
        onLeave={onLeave}
      />

      <div className="chatroom-main">
        {/* Header */}
        <header className="chatroom-header">
          <div className="header-room">
            <span className="header-hash">#</span>
            <h2 className="header-room-name">{room}</h2>
          </div>
          <div className="header-meta">
            {socket.connected ? (
              <span className="status-connected">● Connected</span>
            ) : (
              <span className="status-disconnected">● Reconnecting…</span>
            )}
            <span className="header-users">
              {onlineUsers.length} online
            </span>
          </div>
        </header>

        {/* Error banner */}
        {socketError && (
          <div className="error-banner">{socketError}</div>
        )}

        {/* Messages */}
        <div className="messages-area">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner" />
              <p>Loading messages…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <p>No messages yet. Say hello!</p>
            </div>
          ) : (
            renderMessages()
          )}

          {/* Typing indicator */}
          {typingUser && (
            <div className="typing-indicator">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
              <span className="typing-label">{typingUser} is typing…</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <MessageInput
          onSend={handleSend}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          disabled={!socket.connected}
        />
      </div>
    </div>
  );
}

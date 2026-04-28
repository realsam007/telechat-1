import { useState, useRef, useCallback } from "react";
import "./MessageInput.css";

export default function MessageInput({ onSend, onTyping, onStopTyping, disabled }) {
  const [text, setText] = useState("");
  const typingTimeout = useRef(null);
  const isTyping = useRef(false);

  const handleChange = (e) => {
    setText(e.target.value);

    if (!isTyping.current) {
      isTyping.current = true;
      onTyping?.();
    }

    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      isTyping.current = false;
      onStopTyping?.();
    }, 1500);
  };

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;

    onSend(trimmed);
    setText("");
    isTyping.current = false;
    clearTimeout(typingTimeout.current);
    onStopTyping?.();
  }, [text, disabled, onSend, onStopTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="message-input-bar">
      <textarea
        className="message-textarea"
        placeholder="Type a message… (Enter to send)"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        maxLength={1000}
      />
      <button
        className={`send-btn ${text.trim() ? "active" : ""}`}
        onClick={handleSend}
        disabled={!text.trim() || disabled}
        title="Send message"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M22 2L11 13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22 2L15 22L11 13L2 9L22 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

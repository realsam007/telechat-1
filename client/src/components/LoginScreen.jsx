import { useState } from "react";
import "./LoginScreen.css";

const PRESET_ROOMS = ["global", "tech", "gaming", "movies", "random"];

export default function LoginScreen({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("global");
  const [customRoom, setCustomRoom] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = username.trim();
    const selectedRoom = customRoom.trim() || room;

    if (!name) {
      setError("Please enter your username.");
      return;
    }
    if (name.length < 2) {
      setError("Username must be at least 2 characters.");
      return;
    }
    if (!selectedRoom) {
      setError("Please select or enter a room name.");
      return;
    }

    setError("");
    onJoin(name, selectedRoom.toLowerCase().replace(/\s+/g, "-"));
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                fill="white"
              />
              <circle cx="8" cy="11" r="1.2" fill="var(--primary)" />
              <circle cx="12" cy="11" r="1.2" fill="var(--primary)" />
              <circle cx="16" cy="11" r="1.2" fill="var(--primary)" />
            </svg>
          </div>
          <h1 className="logo-text">TeleChat</h1>
        </div>

        <p className="login-tagline">Real-time messaging, anywhere.</p>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Username */}
          <div className="form-group">
            <label className="form-label">Your Name</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. Samarth"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError("");
              }}
              maxLength={30}
              autoFocus
            />
          </div>

          {/* Room picker */}
          <div className="form-group">
            <label className="form-label">Choose a Room</label>
            <div className="room-chips">
              {PRESET_ROOMS.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`room-chip ${room === r && !customRoom ? "active" : ""}`}
                  onClick={() => {
                    setRoom(r);
                    setCustomRoom("");
                  }}
                >
                  # {r}
                </button>
              ))}
            </div>
          </div>

          {/* Custom room */}
          <div className="form-group">
            <label className="form-label">Or Create a Custom Room</label>
            <input
              className="form-input"
              type="text"
              placeholder="my-custom-room"
              value={customRoom}
              onChange={(e) => setCustomRoom(e.target.value)}
              maxLength={30}
            />
          </div>

          {/* Error */}
          {error && <p className="form-error">{error}</p>}

          {/* Submit */}
          <button type="submit" className="join-btn">
            Join Chat →
          </button>
        </form>
      </div>
    </div>
  );
}

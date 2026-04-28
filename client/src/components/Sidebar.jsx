import "./Sidebar.css";

export default function Sidebar({
  username,
  currentRoom,
  onlineUsers,
  onLeave,
}) {
  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z"
                fill="white"
              />
            </svg>
          </div>
          <span className="sidebar-logo-text">TeleChat</span>
        </div>
      </div>

      {/* Current Room */}
      <div className="sidebar-section">
        <p className="sidebar-section-label">Current Room</p>
        <div className="room-badge">
          <span className="room-hash">#</span>
          <span className="room-name">{currentRoom}</span>
        </div>
      </div>

      {/* Online Users */}
      <div className="sidebar-section flex-grow">
        <p className="sidebar-section-label">
          Online — {onlineUsers.length}
        </p>
        <ul className="users-list">
          {onlineUsers.map((user) => (
            <li key={user} className="user-item">
              <span className="user-dot" />
              <span className="user-name">
                {user}
                {user === username && (
                  <span className="user-you"> (you)</span>
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Profile + Leave */}
      <div className="sidebar-footer">
        <div className="profile-row">
          <div className="profile-avatar">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <p className="profile-name">{username}</p>
            <p className="profile-status">● Online</p>
          </div>
        </div>
        <button className="leave-btn" onClick={onLeave} title="Leave chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M16 17L21 12L16 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </aside>
  );
}

import { useState } from "react";
import LoginScreen from "./components/LoginScreen";
import ChatRoom from "./components/ChatRoom";
import { useSocket } from "./hooks/useSocket";

export default function App() {
  const [session, setSession] = useState(null); // { username, room }
  const socket = useSocket();

  const handleJoin = (username, room) => {
    setSession({ username, room });
  };

  const handleLeave = () => {
    setSession(null);
  };

  if (!session) {
    return <LoginScreen onJoin={handleJoin} />;
  }

  return (
    <ChatRoom
      username={session.username}
      room={session.room}
      socket={socket}
      onLeave={handleLeave}
    />
  );
}

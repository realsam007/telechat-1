import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

export function useSocket() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      setError("Unable to connect to server. Retrying…");
      console.error("Socket connection error:", err.message);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = useCallback((username, room) => {
    socketRef.current?.emit("join_room", { username, room });
  }, []);

  const sendMessage = useCallback((from, room, text) => {
    socketRef.current?.emit("send_message", { from, room, text });
  }, []);

  const emitTyping = useCallback((username, room) => {
    socketRef.current?.emit("typing", { username, room });
  }, []);

  const emitStopTyping = useCallback((room) => {
    socketRef.current?.emit("stop_typing", { room });
  }, []);

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socketRef.current?.off(event, handler);
  }, []);

  return { connected, error, joinRoom, sendMessage, emitTyping, emitStopTyping, on, off };
}

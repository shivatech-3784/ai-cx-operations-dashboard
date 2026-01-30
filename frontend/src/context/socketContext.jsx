import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./authContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { user, loading, accessToken } = useAuth(); // 👈 token here

  useEffect(() => {
    if (loading || !user || !accessToken) return;

    console.log("🔌 Connecting socket with token");

    socketRef.current = io("http://localhost:5000", {
      auth: {
        token: accessToken, // 👈 sent explicitly
      },
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("🔌 Socket connected:", socketRef.current.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connect error:", err.message);
    });

    socketRef.current.on("notification", (data) => {
      console.log("🔔 Notification:", data);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user, loading, accessToken]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

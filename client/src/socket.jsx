import { createContext, useMemo, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const SocketContext = createContext();
let socketInstance;

export const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(
      import.meta.env.REACT_APP_SOCKET_SERVER || "http://localhost:3000",
      {
        withCredentials: true,
      }
    );
  }
  return socketInstance;
};

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => getSocket(), []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);

      // Rejoin rooms after reconnecting
      const roomId = localStorage.getItem("currentRoomId");
      if (roomId) {
        socket.emit("joinRoom", roomId);
        console.log(`Rejoined room: ${roomId}`);
      }
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });
    socket.onAny((event, data) => {
      console.log(`Received event: ${event}`, data);
    });
    
    return () => {
      socket.disconnect();
      console.log("Disconnecting user")
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider };
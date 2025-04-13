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
        transports: ["polling", "websocket"],
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
      console.log("Recovered?", socket.recovered);

      const roomId = localStorage.getItem("currentRoomId");
      if (!socket.recovered && roomId) {
        socket.emit("joinRoom", roomId);
        console.log(`Rejoined room manually: ${roomId}`);
      } else {
        console.log("Recovery succeeded; no need to manually rejoin room");
      }
    });

    socket.on("socketError", (err) => {
      console.error("Socket connection error:", err);
    });

    socket.onAny((event, data) => {
      console.log(`Received event: ${event}`, data);
    });

    return () => {
      socket.off("connect");
      socket.off("socketError");
      socket.offAny();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider };

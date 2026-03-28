import { createContext, useMemo, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const SocketContext = createContext();
let socketInstance;

export const getSocket = () => {
  // console.log("checking for socket");
  if (!socketInstance) {
    socketInstance = io(
      import.meta.env.REACT_APP_SOCKET_SERVER || "http://localhost:3000",
      {
        withCredentials: true,
        transports: ["polling", "websocket"],
      }
    );
    // console.log(socketInstance, "creating socket bby");
  }

  return socketInstance;
};

const SocketProvider = ({ children }) => {
  const socket = getSocket();

  useEffect(() => {
    const onConnect = () => console.log("connected", socket.id);
    const onError = (err) => console.error("Socket error:", err);
    const onAny = (event, data) => console.log(`Event: ${event}`, data);

    socket.on("connect", onConnect);
    socket.on("socketError", onError);
    socket.onAny(onAny);

    return () => {
      socket.off("connect", onConnect);
      socket.off("socketError", onError);
      socket.offAny(onAny);
    };
  }, [socket]);
  // console.log("socket.jsx",socketInstance)
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider };

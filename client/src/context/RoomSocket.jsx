import React, { createContext, useContext, useEffect,useState } from "react";
import { getSocket } from "@/socket";
import { useLocation } from "react-router-dom";

const RoomSocketContext = createContext();

export const useRoomSocket = () => useContext(RoomSocketContext);

export const RoomSocketProvider = ({ children }) => {
  const socket = getSocket();
  const location = useLocation();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const joinRoom = (roomId) => {
    if (roomId && location.pathname.includes(`/room/${roomId}`)) {
      socket.emit("joinRoom", roomId);
      console.log(`Joined room: ${roomId}`);
      localStorage.setItem("currentRoomId", roomId);
    }
  };

  const leaveRoom = (roomId) => {
    if (roomId) {
      socket.emit("leaveRoom", roomId);
      console.log(`Left room: ${roomId}`);
      localStorage.removeItem("currentRoomId");
    }
  };

  useEffect(() => {
    const handleOnlineUsersUpdate = ({ users, count }) => {
      console.log("🟢 Online users updated");
      console.log("Users:", users);
      setOnlineUsers(users);
    };

    socket.on("onlineUsersUpdated", handleOnlineUsersUpdate);

    return () => {
      socket.off("onlineUsersUpdated", handleOnlineUsersUpdate);
    };
  }, [socket]);

  return (
    <RoomSocketContext.Provider value={{ joinRoom, leaveRoom, onlineUsers }}>
      {children}
    </RoomSocketContext.Provider>
  );
};

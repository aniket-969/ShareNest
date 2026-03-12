import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/socket";
import { useParams } from "react-router-dom";

const RoomSocketContext = createContext();

export const useRoomSocket = () => useContext(RoomSocketContext);

export const RoomSocketProvider = ({ children }) => {
  const { roomId } = useParams();
  const socket = getSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!roomId) return;

    const handleOnlineUsersUpdate = ({ users, count }) => {
      console.log("🟢 Online users updated");
      setOnlineUsers(users);
    };

    //  listener added before joining to avoid race condition
    socket.on("onlineUsersUpdated", handleOnlineUsersUpdate);

    const joinRoom = () => {
      socket.emit("joinRoom", roomId);
      console.log("Joined room", roomId);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    return () => {
      socket.off("onlineUsersUpdated", handleOnlineUsersUpdate);
      socket.off("connect", joinRoom);
      socket.emit("leaveRoom", roomId);
      setOnlineUsers([]);
    };
  }, [roomId]);

  return (
    <RoomSocketContext.Provider value={{ onlineUsers }}>
      {children}
    </RoomSocketContext.Provider>
  );
};

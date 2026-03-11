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

    const joinRoom = () => {
      socket.emit("joinRoom", roomId);
      console.log("Joined room", roomId);
    };

    if (socket.connected) {
      console.log("connected")
      joinRoom();
    } else {
      socket.once("connect", joinRoom);
    }

    return () => {
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    const handleOnlineUsersUpdate = ({ users, count }) => {
      console.log("🟢 Online users updated");
      // console.log("Users:", users);
      setOnlineUsers(users);
    };

    socket.on("onlineUsersUpdated", handleOnlineUsersUpdate);

    return () => {
      socket.off("onlineUsersUpdated", handleOnlineUsersUpdate);
    };
  }, [socket]);

  return (
    <RoomSocketContext.Provider value={{ onlineUsers }}>
      {children}
    </RoomSocketContext.Provider>
  );
};

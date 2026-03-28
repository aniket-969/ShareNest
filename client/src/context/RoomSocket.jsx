import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/socket";
import { useParams } from "react-router-dom";

const RoomSocketContext = createContext();

export const useRoomSocket = () => useContext(RoomSocketContext);

export const RoomSocketProvider = ({ children }) => {
  const { roomId } = useParams();
  const socket = getSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);

  const handleOnlineUsersUpdate = ({ users, count }) => {
    // console.log("online member even triggered");

    setOnlineUsers(users);
  };

  const joinRoom = () => {
    socket.emit("joinRoom", roomId);
    // console.log("Emitting join room event", roomId);
  };
  
  useEffect(() => {
    if (!roomId) return;

    //  listener added before joining to avoid race condition
    socket.on("onlineUsersUpdated", handleOnlineUsersUpdate);

    if (socket.connected) {
      // console.log("socket is connected so joining");
      joinRoom();
    } else {
      // console.log("Socket not connected so once triggered");
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

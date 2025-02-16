import React, { createContext, useContext, useEffect } from "react";
import { getSocket } from "@/socket";
import { useLocation } from "react-router-dom";

const RoomSocketContext = createContext();

export const useRoomSocket = () => useContext(RoomSocketContext);

export const RoomSocketProvider = ({ children }) => {
  const socket = getSocket();
  const location = useLocation();

  const joinRoom = (roomId) => {
    // Only join if we're actually on a room route
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

  return (
    <RoomSocketContext.Provider value={{ joinRoom, leaveRoom }}>
      {children}
    </RoomSocketContext.Provider>
  );
};

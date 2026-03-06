import React, { createContext, useContext, useEffect,useState } from "react";
import { getSocket } from "@/socket";
import { useParams } from "react-router-dom";

const RoomSocketContext = createContext();

export const useRoomSocket = () => useContext(RoomSocketContext);

export const RoomSocketProvider = ({ children }) => {
  const {roomId} = useParams()
  const socket = getSocket();
  const [onlineUsers, setOnlineUsers] = useState([]);

 useEffect(() => {
    if (!roomId) return;

    socket.emit("joinRoom", roomId);
    console.log(`Joined room: ${roomId}`);

    return () => {
      socket.emit("leaveRoom", roomId);
      console.log(`Left room: ${roomId}`);
    };
  }, [roomId, socket]);


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
    <RoomSocketContext.Provider value={{  onlineUsers }}>
      {children}
    </RoomSocketContext.Provider>
  );
};

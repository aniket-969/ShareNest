import { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/socket";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const socket = getSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleAny = (event, payload) => {
      // Exclude some events if needed
      if (
        ["messageReceived", "createdTask", "createMaintenance"].includes(event)
      ) {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.onAny(handleAny);
    return () => {
      socket.offAny(handleAny);
    };
  }, [socket]);

  const resetCount = () => setUnreadCount(0);

  return (
    <NotificationContext.Provider value={{ unreadCount, resetCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

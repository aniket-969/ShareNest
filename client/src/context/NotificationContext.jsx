import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/socket";
import { useAuth } from "@/hooks/useAuth";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { sessionQuery } = useAuth();

  // console.log(sessionQuery.data);
  const socket = getSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // In-app socket notifications
  useEffect(() => {
    
    const handleAny = (event, payload) => {
      let message = null;
      const actor = payload.actor || {};

      switch (event) {
        case "createdTask":
          message = `created a new task "${payload.title}"`;
          break;

        case "createdAward":
          message = `received a new award "${payload.title}"`;
          break;

        case "createdExpense":
          message = `added a new expense "${payload.title}"`;
          break;

        case "createdPoll":
          message = `created a poll "${payload.title}"`;
          break;

        default:
          return;
      }

      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          message,
          actor: {
            fullName: actor.fullName || "Someone",
            avatar: actor.avatar || null,
          },
          seen: false,
        },
        ...prev,
      ]);

      setUnreadCount((c) => c + 1);
    };

    socket.onAny(handleAny);
    return () => {
      socket.offAny(handleAny);
    };
  }, [socket]);

  const markAllSeen = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, seen: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllSeen }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

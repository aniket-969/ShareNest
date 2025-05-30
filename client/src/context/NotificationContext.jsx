import React, { createContext, useContext, useEffect, useState } from "react";
import { getSocket } from "@/socket";
import { useAuth } from "@/hooks/useAuth";
import { deleteToken, getToken } from "firebase/messaging";
import { messaging } from "@/firebase/config";

const NotificationContext = createContext();
export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { sessionQuery, updateNotificationTokenMutation } = useAuth();
  const storedToken = sessionQuery.data?.notificationToken;
  console.log(sessionQuery.data);
  const { mutate: updateToken } = updateNotificationTokenMutation;

  const socket = getSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // In-app socket notifications
  useEffect(() => {
    const handleAny = (event, payload) => {
      let message = null;

      switch (event) {
        case "createdTask":
          message = `${payload.actor || "Someone"} created a new task "${payload.title}"`;
          break;
        case "createdAward":
          message = `${payload.assignedTo || "Someone"} received a new award "${payload.title}"`;
          break;
        case "createdExpense":
          message = `${payload.paidBy || "Someone"} added a new expense "${payload.title}"`;
          break;
        case "createdMaintenance":
          message = `New maintenance request for "${payload.title}" was created`;
          break;
        case "createdPoll":
          message = `${payload.actor || "Someone"} created a poll "${payload.title}"`;
          break;
        default:
          return;
      }

      setNotifications((prev) => [
        { id: Date.now(), message, seen: false },
        ...prev,
      ]);
      setUnreadCount((c) => c + 1);
    };

    socket.onAny(handleAny);
    return () => {
      socket.offAny(handleAny);
    };
  }, [socket]);

  // Notification Permission
  useEffect(() => {
    let permStatus;
    navigator.permissions
      .query({ name: "notifications" })
      .then((status) => {
        permStatus = status;
        console.log("in permission");
        status.onchange = async () => {
          if (status.state === "denied") {
            console.log("denied");
            await deleteToken(messaging);
            console.log("deleted");
            updateToken({ token: null });
          }
          if (status.state === "granted") {
            console.log("granted");
          }
        };
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      if (permStatus) permStatus.onchange = null;
    };
  }, [updateToken]);

  // FCM registration / token sync
  useEffect(() => {
    console.log("Starting noti ");
    if (!sessionQuery.isSuccess) return;
    if (storedToken) return;
    console.log("found the token");
    const registerFcmToken = async () => {
      if (Notification.permission === "default") {
        console.log("Before permission");
        await Notification.requestPermission();
        console.log("after permission");
      }
      if (Notification.permission !== "granted") return;
      console.log("Permission granted");
      try {
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });
        if (currentToken && currentToken !== storedToken) {
          updateToken({ token: currentToken });
        }
      } catch (err) {
        console.error("FCM getToken failed:", err);
      }
    };

    registerFcmToken();
  }, [sessionQuery.isSuccess, storedToken, updateToken]);

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

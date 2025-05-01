// NotificationContext.jsx
import { createContext, useContext, useEffect, useState } from "react"
import { getSocket } from "@/socket" // wherever your enums live

const NotificationContext = createContext()
export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const socket = getSocket()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const handleAny = (event, payload) => {
      let message = null

      switch (event) {
        case "createdTask":
          message = `${payload.actor || "Someone"} created a new task "${payload.title}"`
          break

        case AwardEventEnum.AWARD_CREATED_EVENT:
          message = `${payload.actor || "Someone"} created a new award "${payload.title}"`
          break

        case ExpenseEventEnum.EXPENSE_CREATED_EVENT:
          message = `${payload.actor || "Someone"} added a new expense "${payload.title}"`
          break

        case MaintenanceEventEnum.MAINTENANCE_CREATED_EVENT:
          message = `${payload.actor || "Someone"} requested maintenance "${payload.title}"`
          break

        case PollEventEnum.CREATE_POLL_EVENT:
          message = `${payload.actor || "Someone"} created a poll "${payload.title}"`
          break

        default:
          return // ignore other events
      }

      // prepend the new notification
      setNotifications((prev) => [
        { id: Date.now(), message, seen: false },
        ...prev,
      ])
      setUnreadCount((c) => c + 1)
    }

    socket.onAny(handleAny)
    return () => {
      socket.offAny(handleAny)
    }
  }, [socket])

  const markAllSeen = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, seen: true }))
    )
    setUnreadCount(0)
  }

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllSeen }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

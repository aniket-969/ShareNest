import { createContext, useContext, useEffect, useState } from "react"
import { getSocket } from "@/socket" 

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

        case "createdAward":
          message = `${payload.assignedTo || "Someone"} received a new award "${payload.title}"`
          break

        case "createdExpense":
          message = `${payload.paidBy || "Someone"} added a new expense "${payload.title}"`
          break

        case "createdMaintenance":
          message = `New maintenance request for ${payload.title} was created`
          break

        case "createdPoll":
          message = `${payload.actor || "Someone"} created a poll "${payload.title}"`
          break

        default:
          return 
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

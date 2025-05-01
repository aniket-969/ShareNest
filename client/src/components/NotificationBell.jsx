import { useState, useEffect, useRef } from "react"
import { Bell } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useNotifications } from "@/context/NotificationContext"

const NotificationBell = () => {
  const { unreadCount, notifications, markAllSeen } = useNotifications()
  const [open, setOpen] = useState(false)
  const panelRef = useRef()

  // close if clicked outside
  useEffect(() => {
    const onClick = (e) => {
      if (open && panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    window.addEventListener("mousedown", onClick)
    return () => window.removeEventListener("mousedown", onClick)
  }, [open])

  const toggle = () => {
    // when opening, clear unread
    if (!open) markAllSeen()
    setOpen((o) => !o)
  }

  return (
    <div className="notification rounded-3xl flex justify-center items-center hover:bg-muted/30 transition-colors">
    <div className="relative ">
      <button
        onClick={toggle}
        className="p-2 "
      >
        <Bell className="w-6 h-6 text-primary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-80 max-h-64 bg-background border border-primary rounded-lg shadow-lg z-50"
        >
          <ScrollArea className="h-full">
            <div className="p-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notifications
                </p>
              ) : (
                notifications.map((note) => (
                  <div
                    key={note.id}
                    className="mb-2 last:mb-0 p-2 rounded hover:bg-muted/80 transition"
                  >
                    <p className="text-sm">{note.message}</p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div></div>
  )
}

export default NotificationBell

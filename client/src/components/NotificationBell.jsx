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
  const fakeNotifications = [
    { id: 1,  message: 'Alice created a new task "Write unit tests"',        seen: false },
    { id: 2,  message: 'Bob created a poll "Best lunch spot?"',             seen: false },
    { id: 4,  message: 'Dan requested maintenance "Air conditioner fix"',   seen: false },
    { id: 5,  message: 'Eve created a custom award "Top Debugger"',         seen: false },
    { id: 6,  message: 'Frank created a new task "Deploy to staging"',      seen: false },
    { id: 7,  message: 'Grace created a poll "Remote vs Office?"',          seen: false },
    { id: 8,  message: 'Heidi added a new expense "Conference ticket ($300)"', seen: false },
    { id: 9,  message: 'Ivan requested maintenance "Printer repair"',       seen: false },
    { id: 10, message: 'Judy created a custom award "UX Champion"',         seen: false },
    { id: 11, message: 'Mallory created a new task "Update dependencies"',  seen: false },
    { id: 12, message: 'Niaj created a poll "UI theme choice"',             seen: false },
    { id: 13, message: 'Olivia added a new expense "Client dinner ($85)"',  seen: false },
    { id: 14, message: 'Peggy requested maintenance "Network reboot"',      seen: false },
    { id: 15, message: 'Sybil created a custom award "Bug Basher"',         seen: false },
    { id: 16, message: 'Trent created a new task "Refactor login flow"',    seen: false },
    { id: 17, message: 'Victor created a poll "Sprint retrospective date"', seen: false },
    { id: 18, message: 'Wendy added a new expense "Office snacks ($45)"',    seen: false },
    { id: 19, message: 'Xavier requested maintenance "Window lock fix"',    seen: false },
    { id: 20, message: 'Yvonne created a custom award "Documentation Hero"',seen: false },
  ];
  
  const toggle = () => {
    // when opening, clear unread
    if (!open) markAllSeen()
    setOpen((o) => !o)
  }

  return (
    <div className="notification rounded-3xl flex justify-center items-center hover:bg-muted/30 transition-colors ">
    <div className="relative">
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
          className="absolute right-0 mt-2 w-80  bg-background border border-primary rounded-lg shadow-lg z-50"
        >
          <ScrollArea className="h-40 m-2">
            <div className="p-2">
              {fakeNotifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No notifications
                </p>
              ) : (
                fakeNotifications.map((note) => (
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

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/context/NotificationContext";

const NotificationBell = () => {
  const { unreadCount, notifications, markAllSeen } = useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef();

  // close if clicked outside
  useEffect(() => {
    const onClick = (e) => {
      if (open && panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, [open]);

  const toggle = () => {
    if (!open) markAllSeen();
    setOpen((o) => !o);
  };

  return (
    <div className="notification rounded-3xl flex justify-center items-center hover:bg-muted/30 transition-colors bg-card borde">
      <div className="relative ">
        <button onClick={toggle} className="p-2 ">
          <Bell className=" text-primary p-[0.15rem]" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 p-[0.1rem] right-1 bg-black text-white text-xs ">
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
                {notifications.length === 0 ? (
                  <p className="text-md text-muted-foreground text-center py-2">
                    No notifications
                  </p>
                ) : (
                  notifications.map((note) => (
                    <div
                      key={note.id}
                      className="mb-2 last:mb-0 p-2 rounded hover:bg-muted/80 transition"
                    >
                      <div className="flex items-start gap-2">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full overflow-hidden bg-muted flex-shrink-0">
                          {note.actor?.avatar ? (
                            <img
                              src={note.actor.avatar}
                              alt={note.actor.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs">
                              {note.actor?.fullName?.[0]}
                            </div>
                          )}
                        </div>

                        {/* Message */}
                        <p className="text-sm leading-tight">
                          <span className="font-medium">
                            {note.actor?.fullName || "Someone"}
                          </span>{" "}
                          {note.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;

import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

const NotificationBell = () => {
  const { unreadCount,markAllSeen,notifications } = useNotifications();
console.log(notifications)
  return (
    <div className="relative ">
      <Bell className="p-[0.18rem] " />
      {unreadCount > 0 ? (
        <span className="absolute -top-2 -right-2  text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {unreadCount}
        </span >
      ):<span className="absolute -top-3 -right-1 bg-black  text-foreground font-[400] text-base flex items-center justify-center rounded-full">0</span>}
    </div>
  );
};

export default NotificationBell;

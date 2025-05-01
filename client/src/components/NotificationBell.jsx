import { Bell } from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";

const NotificationBell = () => {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className="w-6 h-6 text-primary" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;

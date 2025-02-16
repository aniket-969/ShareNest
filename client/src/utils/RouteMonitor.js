import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import { getSocket } from "@/socket"; // adjust import path

export const RouteMonitor = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const socket = getSocket();

  useEffect(() => {
    const cleanupRoom = () => {
      const currentPath = location.pathname;
      const currentRoomId = localStorage.getItem("currentRoomId");

      if (!currentPath.includes("/room/") && currentRoomId) {
        socket.emit("leaveRoom", currentRoomId);
        console.log(
          `Cleanup: Left room ${currentRoomId} (${navigationType} navigation)`
        );
        localStorage.removeItem("currentRoomId");
      }
    };

    cleanupRoom();
  }, [location.pathname, navigationType]);

  return null;
};

import { getSocket } from "@/socket";
import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useRoomSocket } from "@/context/RoomSocket";

export const RoomLayout = () => {
  const { roomId } = useParams();
  const { joinRoom, leaveRoom } = useRoomSocket();
  const session = localStorage.getItem("session");

  // join room socket
  useEffect(() => {
    if (roomId) {
      joinRoom(roomId);
      return () => leaveRoom(roomId);
    }
  }, [roomId]);


  if (!roomId) {
    return <Navigate to="/room" />;
  }
  if (!session) {
    localStorage.clear();
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full ">
        <AppSidebar />
        <main className=" w-full overflow-hidden">
          <SidebarTrigger />
          <div className="p-2 w-full ">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default RoomLayout;

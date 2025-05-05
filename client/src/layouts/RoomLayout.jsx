import { getSocket } from "@/socket";
import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useRoomSocket } from "@/context/RoomSocket";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="flex w-full">
      {/*  sidebar in its own Suspense */}
      <Suspense fallback={<div className="p-4"><Spinner /></div>}>
        <AppSidebar />
      </Suspense>

      <main className="w-full overflow-hidden">
        <SidebarTrigger />
        <div className="px-2 py-5 w-full">
          {/*  outlet content in its own Suspense */}
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  </SidebarProvider>
  );
};

export default RoomLayout;

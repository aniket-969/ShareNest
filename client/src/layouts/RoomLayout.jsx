import { getSocket } from "@/socket";
import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useRoomSocket } from "@/context/RoomSocket";
import { Spinner } from "@/components/ui/spinner";
import { useRoom } from "@/hooks/useRoom";

export const RoomLayout = () => {
  const { roomId } = useParams();
  const { joinRoom, leaveRoom } = useRoomSocket();
  const session = localStorage.getItem("session");
  const { roomQuery } = useRoom(roomId);
  const { data: roomData, isLoading, isError } = roomQuery;

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
    <SidebarProvider >
      <div className="flex w-full overflow-y-hidden ">
        {/*  sidebar in its own Suspense */}
        <Suspense
          fallback={
            <div className="p-4">
              <Spinner />
            </div>
          }
        >
          <AppSidebar roomData={roomData} />
        </Suspense>

        <main className="w-full ">
          <SidebarTrigger className=" xl:hidden  "/>
          <div className=" px-2 py-1 w-full xl:pt-[1.75rem]">
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

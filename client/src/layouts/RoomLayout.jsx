import { getSocket } from "@/socket";
import { Suspense, useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/RoomDetails/AppSidebar";
import { useRoomSocket } from "@/context/RoomSocket";
import { Spinner } from "@/components/ui/spinner";
import SidebarSkeleton from "@/components/skeleton/Room/sidebar";

export const RoomLayout = () => {
  const { roomId } = useParams();

  if (!roomId) {
    return <Navigate to="/room" />;
  }
 

  return (
    <SidebarProvider className="">
      <div className="flex w-full overflow-y-hidden ">
        {/* DESKTOP SIDEBAR SLOT (≥1280px only) */}

        <Suspense fallback={<SidebarSkeleton />}>
          <AppSidebar />
        </Suspense>

        <main className="flex-1 min-w-0 w-full ">
          <div className="xl:hidden sm:p-2 ">
            <SidebarTrigger />
          </div>

          <div className="px-2 py-1 w-full xl:pt-[1.75rem]">
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

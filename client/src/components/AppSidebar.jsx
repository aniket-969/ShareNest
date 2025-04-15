import {
  Award,
  CalendarDays,
  ClipboardList,
  Hammer,
  Home,
  Inbox,
  Settings,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import { useRoom } from "@/hooks/useRoom";
import { useState, lazy } from "react";
import { Spinner } from "./ui/spinner";

const RoomMembers = lazy(() => import("@/components/Sidebar/RoomMembers"));
const PendingRequests = lazy(
  () => import("@/components/Sidebar/PendingRequests")
);

export function AppSidebar() {
  const { roomId } = useParams();
  const { roomQuery } = useRoom(roomId);
  const { data: roomData, isLoading, isError } = roomQuery;
  const [showMembers, setShowMembers] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  if (isLoading || !roomId) {
    return <Spinner />;
  }
  if (isError) {
    return <p>Please Refresh</p>;
  }
  const toggleMembers = () => {
    setShowMembers(!showMembers);
    if (!showMembers) setShowRequests(false);
  };

  const toggleRequests = () => {
    setShowRequests(!showRequests);
    if (!showRequests) setShowMembers(false);
  };

  const items = [
    { title: "Home", url: "/room", icon: Home },
    { title: "Room", url: `/room/${roomId}`, icon: Inbox },
    {
      title: "Awards",
      url: `/room/${roomId}/awards`,
      icon: Award,
    },
    {
      title: "Events",
      url: `/room/${roomId}/events`,
      icon: CalendarDays,
    },
    {
      title: "Expense",
      url: `/room/${roomId}/expense`,
      icon: Wallet,
    },
    {
      title: "Task",
      url: `/room/${roomId}/tasks`,
      icon: ClipboardList,
    },
    {
      title: "Maintenance",
      url: `/room/${roomId}/maintenance`,
      icon: Hammer,
    },
    {
      title: "Settings",
      url: `/room/${roomId}/settings`,
      icon: Settings,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {/* Room Info */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold line-clamp-1">
            {roomData?.name.toUpperCase() || "Loading..."}
          </h2>
          <p className="text-sm text-muted-foreground line-clamp-3 max-w-full">
            {roomData?.description || ""}
          </p>
        </div>

        {/* Room Members */}
        <RoomMembers
          toggleMembers={toggleMembers}
          showMembers={showMembers}
          tenants={roomData?.tenants}
        />

        {/* Pending Requests */}
        {roomData?.pendingRequests && (
          <PendingRequests
            pendingRequests={roomData?.pendingRequests}
            showRequests={showRequests}
            toggleRequests={toggleRequests}
          />
        )}

        {/* Menu Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a
                      href={item.url}
                      className="flex items-center space-x-3 px-3 py-2 hover:bg-accent rounded-lg"
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

import {
  Award,
  CalendarDays,
  ClipboardList,
  Hammer,
  Home,
  Inbox,
  Settings,
  Wallet,
  Users,
  UserPlus,
  Zap
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
import { useState } from "react";

export function AppSidebar() {
  const { roomId } = useParams();
  const { roomQuery } = useRoom(roomId);
  const { data: roomData, isLoading } = roomQuery;
  const [showMembers, setShowMembers] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
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
    { title: "Room", url: roomId ? `/room/${roomId}` : "/room", icon: Inbox },
    { title: "Awards", url: roomId ? `/room/${roomId}/awards` : "/room", icon: Award },
    { title: "Events", url: roomId ? `/room/${roomId}/events` : "/room", icon: CalendarDays },
    { title: "Expense", url: roomId ? `/room/${roomId}/expense` : "/room", icon: Wallet },
    { title: "Task", url: roomId ? `/room/${roomId}/tasks` : "/room", icon: ClipboardList },
    { title: "Maintenance", url: roomId ? `/room/${roomId}/maintenance` : "/room", icon: Hammer },
    { title: "Settings", url: roomId ? `/room/${roomId}/settings` : "/room/settings", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        {/* Room Info */}
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">{roomData?.name || "Loading..."}</h2>
          <p className="text-sm text-muted-foreground">{roomData?.description || ""}</p>
        </div>

        {/* Room Members */}
        <div className="p-4 border-b">
          <div className="flex items-center text-sm cursor-pointer space-x-2" onClick={toggleMembers}>
            <Users className="w-5 h-5" />
            <span className="flex-1 font-medium">Members</span>
            <span className="text-xs bg-secondary px-2 py-1 rounded-full">{roomData?.tenants?.length || 0}</span>
          </div>
          {showMembers && (
            <div className="mt-3">
              <ScrollArea className="h-[104px]">
                <div className="space-y-2 pr-3">
                  {roomData?.tenants?.map((member) => (
                    <div key={member._id} className="flex items-center p-2 bg-secondary/20 rounded-lg">
                      <img src={member.avatar} alt={member.fullName} className="w-8 h-8 rounded-full mr-3 border" />
                      <span className="text-sm font-medium">{member.fullName}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Pending Requests */}
        <div className="p-4 border-b">
          <div className="flex items-center text-sm cursor-pointer space-x-2" onClick={toggleRequests}>
            <Zap className="w-5 h-5" />
            <span className="flex-1 font-medium">Join Requests</span>
            <span className="text-xs bg-secondary px-2 py-1 rounded-full">{roomData?.pendingRequests?.length || 0}</span>
          </div>
          {showRequests && (
            <div className="mt-3">
              <ScrollArea className="h-[104px]">
                <div className="space-y-2 pr-3">
                  {roomData?.pendingRequests?.map((request) => (
                    <div key={request._id} className="flex items-center p-2 bg-secondary/20 rounded-lg">
                      <img src={request.userId.avatar} alt={request.userId.fullName} className="w-8 h-8 rounded-full mr-3 border" />
                      <span className="text-sm font-medium">{request.userId.fullName}</span>
                      <UserPlus className="ml-auto cursor-pointer hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a href={item.url} className="flex items-center space-x-3 px-3 py-2 hover:bg-accent rounded-lg">
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